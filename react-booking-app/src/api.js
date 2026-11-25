import { requireSupabase } from './supabase.js'

const MATCH_COLUMNS = [
  'id',
  'match_no',
  'team1_name',
  'team1_short',
  'team2_name',
  'team2_short',
  'match_date',
  'start_time',
  'venue',
  'general_price',
  'premium_price',
  'vip_price',
  'available_seats',
  'sort_order',
].join(', ')

/** Convert an `ipl_matches` row into the shape MatchCard expects. */
export function mapMatch(row) {
  return {
    id: row.id,
    matchNo: row.match_no,
    team1: { name: row.team1_name, short: row.team1_short },
    team2: { name: row.team2_name, short: row.team2_short },
    date: row.match_date,
    time: row.start_time,
    venue: row.venue,
    prices: {
      general: row.general_price,
      premium: row.premium_price,
      vip: row.vip_price,
    },
    availableSeats: row.available_seats,
    sortOrder: row.sort_order ?? 0,
  }
}

export async function fetchMatches() {
  const { data, error } = await requireSupabase()
    .from('ipl_matches')
    .select(MATCH_COLUMNS)
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []).map(mapMatch)
}

async function removeBooking(client, reference) {
  const { error } = await client.from('ipl_bookings').delete().eq('reference', reference)
  if (error) console.error('Could not roll back booking', reference, error.message)
}

/**
 * Insert the booking, then decrement the match's available seats.
 *
 * The seat update is a compare-and-swap (update … where id = ? and available_seats = ?)
 * so concurrent bookings cannot oversell a match. If it loses the race the
 * inserted booking row is removed and the caller sees an error.
 *
 * Returns { reference, availableSeats }.
 */
export async function createBooking({ match, stand, quantity, totalPrice }) {
  const client = requireSupabase()
  const reference = `IPL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

  const { error: insertError } = await client.from('ipl_bookings').insert({
    reference,
    match_id: match.id,
    stand,
    quantity,
    total_price: totalPrice,
  })

  if (insertError) throw new Error(insertError.message || 'Could not save your booking.')

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const { data: current, error: readError } = await client
      .from('ipl_matches')
      .select('available_seats')
      .eq('id', match.id)
      .single()

    if (readError) {
      await removeBooking(client, reference)
      throw new Error(readError.message)
    }

    if (current.available_seats < quantity) {
      await removeBooking(client, reference)
      throw new Error('Those seats just sold out. Pick another match or fewer tickets.')
    }

    const { data: updated, error: updateError } = await client
      .from('ipl_matches')
      .update({ available_seats: current.available_seats - quantity })
      .eq('id', match.id)
      .eq('available_seats', current.available_seats)
      .select('available_seats')
      .maybeSingle()

    if (updateError) {
      await removeBooking(client, reference)
      throw new Error(updateError.message)
    }

    if (updated) return { reference, availableSeats: updated.available_seats }
    // Someone else booked between our read and write — read again and retry once.
  }

  await removeBooking(client, reference)
  throw new Error('Someone else just grabbed those seats. Please try again.')
}

/** Live updates for the fixtures table. Returns an unsubscribe function. */
export function subscribeToMatches(onChange) {
  const client = requireSupabase()

  const channel = client
    .channel('ipl-fixtures-live')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'ipl_matches' },
      (payload) => onChange?.(payload),
    )
    .subscribe((status, error) => {
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        console.error('Supabase realtime subscription failed:', error?.message ?? status)
      }
    })

  return () => {
    client.removeChannel(channel)
  }
}

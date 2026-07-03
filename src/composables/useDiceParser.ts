// Supports exactly one dice term — "d20", "2d6", "1d8+3", "4d6dl1",
// "2d20kh1", "2d20kl1", "1d100"/"d%". No "1d6+1d4"-style multi-term sums;
// nothing in the spec demonstrates that and a full expression grammar is
// materially bigger than anything demonstrated.
const NOTATION_RE = /^(\d+)?d(\d+|%)((?:kh|kl|dh|dl)\d+)?([+-]\d+)?$/i

export interface ParsedNotation {
  count: number
  sides: number
  keepDropMod?: string
  flatModifier: number
}

export interface RollResult {
  notation: string
  results: number[]
  dropped: number[]
  modifier: number
  total: number
  isNatural20: boolean
  isNatural1: boolean
  isAdvantage: boolean
  isDisadvantage: boolean
}

export function parseNotation(input: string): ParsedNotation | null {
  const match = NOTATION_RE.exec(input.trim())
  if (!match) return null
  const [, countStr, sidesStr, keepDropMod, flatStr] = match
  // Clamp count to [1, 100] — unbounded input (e.g. a mistyped huge number)
  // would otherwise allocate an unbounded results array.
  const count = Math.max(1, Math.min(100, Number(countStr ?? 1)))
  const sides = sidesStr === '%' ? 100 : Number(sidesStr)
  const flatModifier = flatStr ? Number(flatStr) : 0
  return { count, sides, keepDropMod: keepDropMod?.toLowerCase(), flatModifier }
}

function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1
}

export function rollNotation(input: string): RollResult | null {
  const parsed = parseNotation(input)
  if (!parsed) return null
  const { count, sides, keepDropMod, flatModifier } = parsed

  const results = Array.from({ length: count }, () => rollDie(sides))
  let kept = results
  let dropped: number[] = []

  const modMatch = keepDropMod ? /^(kh|kl|dh|dl)(\d+)$/.exec(keepDropMod) : null
  if (modMatch) {
    const mode = modMatch[1]
    let n = Number(modMatch[2])
    // kh/kl's N is how many to KEEP (must keep at least 1); dh/dl's N is how
    // many to DROP (must keep at least 1 remaining either way).
    n = mode === 'kh' || mode === 'kl' ? Math.max(1, Math.min(n, count)) : Math.max(0, Math.min(n, count - 1))

    const ascendingIndices = results.map((_, i) => i).sort((a, b) => results[a] - results[b])
    let keptIndices: number[]
    if (mode === 'kh') keptIndices = ascendingIndices.slice(count - n)
    else if (mode === 'kl') keptIndices = ascendingIndices.slice(0, n)
    else if (mode === 'dh') keptIndices = ascendingIndices.slice(0, count - n)
    else keptIndices = ascendingIndices.slice(n) // dl

    const keptSet = new Set(keptIndices)
    kept = results.filter((_, i) => keptSet.has(i))
    dropped = results.filter((_, i) => !keptSet.has(i))
  }

  const total = kept.reduce((sum, v) => sum + v, 0) + flatModifier

  return {
    notation: input.trim(),
    results,
    dropped,
    modifier: flatModifier,
    total,
    isNatural20: sides === 20 && kept.includes(20),
    isNatural1: sides === 20 && kept.includes(1),
    isAdvantage: count === 2 && sides === 20 && keepDropMod === 'kh1',
    isDisadvantage: count === 2 && sides === 20 && keepDropMod === 'kl1',
  }
}

// Quick-roll buttons: clicking the die matching the notation's current size
// increments its count; clicking a different size replaces the term
// entirely (consistent with the single-dice-term simplification).
export function appendDie(current: string, sides: number): string {
  const parsed = parseNotation(current)
  if (parsed && parsed.sides === sides) {
    const modSuffix = parsed.keepDropMod ?? ''
    const flatSuffix = parsed.flatModifier ? (parsed.flatModifier > 0 ? '+' : '') + parsed.flatModifier : ''
    return `${parsed.count + 1}d${sides}${modSuffix}${flatSuffix}`
  }
  return `1d${sides}`
}

export function useDiceParser() {
  return { parseNotation, rollNotation, appendDie }
}

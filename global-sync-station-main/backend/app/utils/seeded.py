def seeded(seed: str, t: int) -> float:
    """Deterministic pseudo-random in [-1, 1] from a string + tick.
    Mirrors the FNV-1a variant used in the React client so metrics are
    reproducible across both layers if ever cross-checked."""
    h = 2166136261
    s = f"{seed}:{t}"
    for ch in s:
        h ^= ord(ch)
        h = (h * 16777619) & 0xFFFFFFFF
    return (h / 0xFFFFFFFF) * 2 - 1

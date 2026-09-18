from __future__ import annotations

from time import time


CACHE: dict[tuple[str, str, str], tuple[float, list[dict]]] = {}


def _cache_key(query: str, workspace: str, scope: str) -> tuple[str, str, str]:
    normalized_query = " ".join((query or "").lower().split())
    return normalized_query, str(workspace), str(scope)


def get_cached(query: str, workspace: str, scope: str):
    key = _cache_key(query, workspace, scope)
    item = CACHE.get(key)
    if not item:
        return None
    expires_at, value = item
    if time() > expires_at:
        CACHE.pop(key, None)
        return None
    return value


def set_cache(query: str, workspace: str, scope: str, value: list[dict], ttl: int = 3600):
    CACHE[_cache_key(query, workspace, scope)] = (time() + ttl, value)

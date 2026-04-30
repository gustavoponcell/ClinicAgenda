export function omitPassword<T extends { senhaHash?: string }>(entity: T) {
  const { senhaHash: _senhaHash, ...safeEntity } = entity;
  return safeEntity;
}

export function omitPasswordFromList<T extends { senhaHash?: string }>(items: T[]) {
  return items.map(omitPassword);
}

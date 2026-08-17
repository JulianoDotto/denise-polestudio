export function moveEventTypeIndex(
  currentIndex: number,
  direction: -1 | 1,
  itemCount: number,
) {
  if (itemCount <= 0) return 0
  return (currentIndex + direction + itemCount) % itemCount
}

export function getEventTypeSwipeDirection(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  minimumDistance = 50,
): -1 | 1 | null {
  const horizontalDistance = endX - startX
  const verticalDistance = endY - startY

  if (
    Math.abs(horizontalDistance) < minimumDistance ||
    Math.abs(horizontalDistance) <= Math.abs(verticalDistance)
  ) {
    return null
  }

  return horizontalDistance > 0 ? -1 : 1
}

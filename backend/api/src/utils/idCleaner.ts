export function deleteObjectIds<T extends object>(obj: T): T {
	const result = { ...obj }
	const idsToRemove = ["id", "userId", "_id", "uuid"]

	idsToRemove.forEach((id) => {
		if (id in result) {
			delete result[id as keyof T]
		}
	})

	return result
}

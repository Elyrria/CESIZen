import type { User, Information, Activity, Category } from "@/types/factory"
import {
	AbstractEntityFactory,
	UserImpl,
	TextActivity,
	TextInformation,
	ImageInformation,
	VideoActivity,
	VideoInformation,
	CategoryImpl,
} from "@/factories/index"

class EntityFactory implements AbstractEntityFactory {
	createUser(data: Partial<User>): User {
		return new UserImpl(data)
	}

	createInformation(data: Partial<Information>): Information {
		switch (data.type) {
			case "TEXT":
				return new TextInformation(data)
			case "IMAGE":
				return new ImageInformation(data)
			case "VIDEO":
				return new VideoInformation(data)
			default:
				return new TextInformation(data)
		}
	}

	createActivity(data: Partial<Activity>): Activity {
		switch (data.type) {
			case "TEXT":
				return new TextActivity(data)
			case "VIDEO":
				return new VideoActivity(data)
			default:
				return new TextActivity(data)
		}
	}

	createCategory(data: Partial<Category>): Category {
		return new CategoryImpl(data)
	}
}

const entityFactory = new EntityFactory()
export default entityFactory

jest.mock(
	"@doc/swagger.configs.ts",
	() => ({
		swaggerOptions: {},
		swaggerUiOptions: {},
		swaggerDefinition: {},
		default: {},
	}),
	{ virtual: true }
)

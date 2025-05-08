import http from "http"
import { errorServerHandler } from "@server/errorServerHandler.ts"

// Create a mock for process.exit
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code) => {
  throw new Error(`process.exit called with "${code}"`);
});

// Mock for console.error
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

describe("errorServerHandler", () => {
	let mockServer: http.Server
	let mockError: NodeJS.ErrnoException

	beforeEach(() => {
		// Reset mocks before each test
		jest.clearAllMocks()

		// Create a mock of the HTTP server
		mockServer = {
			address: jest.fn(),
		} as unknown as http.Server

		// Create a mock error
		mockError = new Error() as NodeJS.ErrnoException
		mockError.syscall = "listen"
	})

	afterAll(() => {
		// Restore mocks after all tests
		mockExit.mockRestore()
		mockConsoleError.mockRestore()
	})

	// Test for errors not related to listening
	it("should throw error if syscall is not listen", () => {
		mockError.syscall = "connect"

		expect(() => {
			errorServerHandler(mockError, mockServer, 3000)
		}).toThrow(mockError)
	})

	// Test for EACCES error code
	it("should handle EACCES error correctly", () => {
		mockError.code = "EACCES"
		mockServer.address = jest.fn().mockReturnValue({ port: 3000 })

		expect(() => {
			errorServerHandler(mockError, mockServer, 3000)
		}).toThrow('process.exit called with "1"')

		expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining("requires elevated privileges"))
		expect(mockExit).toHaveBeenCalledWith(1)
	})

	// Test for EADDRINUSE error code
	it("should handle EADDRINUSE error correctly", () => {
		mockError.code = "EADDRINUSE"
		mockServer.address = jest.fn().mockReturnValue({ port: 3000 })

		expect(() => {
			errorServerHandler(mockError, mockServer, 3000)
		}).toThrow('process.exit called with "1"')

		expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining("is already in use"))
		expect(mockExit).toHaveBeenCalledWith(1)
	})

	// Test for unhandled error codes
	it("should throw other errors", () => {
		mockError.code = "UNKNOWN_ERROR"
		mockServer.address = jest.fn().mockReturnValue({ port: 3000 })

		expect(() => {
			errorServerHandler(mockError, mockServer, 3000)
		}).toThrow(mockError)
	})

	// Test for string address formatting
	it("should format string address correctly", () => {
		mockError.code = "EACCES"
		const socketPath = "/tmp/socket"
		mockServer.address = jest.fn().mockReturnValue(socketPath)

		expect(() => {
			errorServerHandler(mockError, mockServer, 3000)
		}).toThrow('process.exit called with "1"')

		expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining(`pipe ${socketPath}`))
	})

	// Test for object address formatting
	it("should format object address correctly", () => {
		mockError.code = "EACCES"
		mockServer.address = jest.fn().mockReturnValue({ port: 3000 })

		expect(() => {
			errorServerHandler(mockError, mockServer, 3000)
		}).toThrow('process.exit called with "1"')

		expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining("Port"))
	})
})
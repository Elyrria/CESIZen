import { getMediaById } from "@controllers/index.ts"
import { Router } from "express"

const getMediaByIdRouter = Router()
/**
 * @swagger
 * /api/v1/informations/media/{id}:
 *   get:
 *     summary: Stream media file associated with an information entry
 *     description: |
 *       Retrieves and streams the media file (image, video) associated with an information entry.
 *       This endpoint directly returns the binary file data with appropriate content headers.
 *       
 *       **Important note**: This endpoint returns raw binary data and not JSON. 
 *       When tested in Swagger UI, you will see a successful response (200) but the content will not be 
 *       displayed properly. To view the actual media, please use the direct URL in a browser or use 
 *       the "Try it out" feature and then copy the curl command to test in a terminal, or use the URL 
 *       directly in an <img> tag or browser.
 *       
 *       Example direct URL: http://localhost:3000/api/v1/informations/media/682367a522de12d1d3d9b0a6
 *     tags: [Informations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectID of the information entry
 *         example: "682367a522de12d1d3d9b0a6"
 *       - in: query
 *         name: download
 *         schema:
 *           type: boolean
 *           enum: ["true", "false"]
 *         description: If set to true, the file will be served with Content-Disposition header for download
 *         example: "false"
 *     responses:
 *       200:
 *         description: |
 *           The media file is streamed successfully.
 *           Response is the raw binary data of the file with appropriate MIME type.
 *           **Note**: Swagger UI cannot display this binary content properly - use the URL directly in a browser to view the media.
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           image/gif:
 *             schema:
 *               type: string
 *               format: binary
 *           image/webp:
 *             schema:
 *               type: string
 *               format: binary
 *           video/mp4:
 *             schema:
 *               type: string
 *               format: binary
 *           video/webm:
 *             schema:
 *               type: string
 *               format: binary
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Information entry or associated media file not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *             examples:
 *               informationNotFound:
 *                 summary: Information entry not found
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "informationNotFound"
 *                     message: "The requested information could not be found"
 *               fileNotFound:
 *                 summary: File not found in storage
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "fileNotFound"
 *                     message: "The requested file could not be found in the storage"
 *       400:
 *         description: No file associated with this information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *             example:
 *               success: false
 *               error:
 *                 code: "fileRequired"
 *                 message: "A file is required for this operation"
 *       403:
 *         description: Unable to access the requested file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *             example:
 *               success: false
 *               error:
 *                 code: "fileAccessError"
 *                 message: "Unable to access the requested file"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *             examples:
 *               streamingError:
 *                 summary: Error streaming file
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "fileStreamingError"
 *                     message: "An error occurred while streaming the file"
 *               fileUploadError:
 *                 summary: File upload failed
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "fileUploadFailed"
 *                     message: "Failed to upload the file"
 *               serverError:
 *                 summary: Unexpected server error
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "unexpectedError"
 *                     message: "An unexpected error occurred"
 *     x-code-samples:
 *       - lang: html
 *         label: Usage in HTML img tag
 *         source: |
 *           <!-- For images, use in an img tag -->
 *           <img src="http://localhost:3000/api/v1/informations/media/682367a522de12d1d3d9b0a6" alt="Media content">
 *           
 *           <!-- For videos, use in a video tag -->
 *           <video controls>
 *             <source src="http://localhost:3000/api/v1/informations/media/682367a522de12d1d3d9b0a6" type="video/mp4">
 *             Your browser does not support the video tag.
 *           </video>
 *       - lang: javascript
 *         label: Fetch example with download parameter
 *         source: |
 *           // To download the file
 *           fetch('http://localhost:3000/api/v1/informations/media/682367a522de12d1d3d9b0a6?download=true')
 *             .then(response => {
 *               if (!response.ok) {
 *                 return response.json().then(err => Promise.reject(err));
 *               }
 *               return response.blob();
 *             })
 *             .then(blob => {
 *               const url = window.URL.createObjectURL(blob);
 *               const a = document.createElement('a');
 *               a.href = url;
 *               a.download = 'downloaded-file';
 *               document.body.appendChild(a);
 *               a.click();
 *               a.remove();
 *             })
 *             .catch(error => {
 *               console.error('Error downloading file:', error);
 *             });
 */
getMediaByIdRouter.get("/media/:id", getMediaById)

export default getMediaByIdRouter

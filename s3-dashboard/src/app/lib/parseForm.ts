import formidable, { File, Files } from 'formidable'
import { IncomingMessage } from 'http'

export const parseForm = (req: IncomingMessage): Promise<{ fields: any; files: Files }> => {
    const form = formidable({ multiples: false, keepExtensions: true })
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) return reject(err)
            resolve({ fields, files })
        })
    })
}
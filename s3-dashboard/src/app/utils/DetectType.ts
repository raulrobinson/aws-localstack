export function detectType(fileName: string): string {
    if (fileName.endsWith('.jpg') || fileName.endsWith('.png')) return 'image'
    if (fileName.endsWith('.pdf')) return 'pdf'
    if (fileName.endsWith('.txt') || fileName.endsWith('.md')) return 'text'
    return 'binary'
}
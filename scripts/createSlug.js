/**
 * @description Create slug.
 * @param {string} inputString 
 * @returns Slugified string.
 */
export function createSlug(inputString) {

    let slug = inputString.trim().toLowerCase().replace(/[^\w\s-]/g, "-")    
    slug = slug.replace(/^-+|-+$/g, "")
    slug = slug.replaceAll(" ", "-")
    slug = slug.replace(/-+/g, "-")

    return slug.toLowerCase()

}
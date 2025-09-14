export const ErrorDataNotFound = new Error("Data Not Found");
export const ErrNameDuplicate = new Error("Name already exists");



// Brand
export const BrandNameTooShortError = new Error("Name must be at least 2 characters");
export const BrandDescriptionTooLongError = new Error("Description must be at most 255 characters");
export const BrandImageInvalidUrlError = new Error("Image must be a valid URL");
export const BrandTaglineTooLongError = new Error("Tag line must be at most 150 characters");
export const BrandInvalidIdError = new Error("ID must be a valid UUID")
export const BrandStatusInvalidError = new Error("Status must be one of 'active', 'inactive', 'deleted'");
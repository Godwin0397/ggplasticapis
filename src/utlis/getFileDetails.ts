const getFileDetails = (originalname: string) => {
    if (originalname.includes("Product")) {
        return {
            type: "Product",
            productName: originalname.split(" Product")[0]
        };
    }

    if (originalname.includes("Machine")) {
        return {
            type: "Machine",
            productName: originalname.split(" Machine")[0]
        };
    }

    return {
        type: "Other",
        productName: originalname.split("Other")[0]
    };
};

export default getFileDetails;
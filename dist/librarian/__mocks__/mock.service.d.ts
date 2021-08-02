/// <reference types="jest" />
export declare const mockedJwtService: {
    sign: jest.Mock<any, any>;
};
export declare const mockRequest: {
    user: import("../librarian.interface").Librarian;
    res: {
        setHeader: jest.Mock<any, any>;
    };
};

/// <reference types="jest" />
export declare const mockedJwtService: {
    sign: jest.Mock<any, any>;
};
export declare const mockRequest: {
    user: import("../reader.interface").Reader;
    res: {
        setHeader: jest.Mock<any, any>;
    };
};

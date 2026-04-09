type foodPartner = {
    id: string;
    name: string;
    email: string;
};

export { };

declare global {
    namespace Express {
        interface Request {
            foodPartner?:
            {
                id: string;
                name: string;
                email: string;
            };
            foodPartnerId?: string;
        }
    }
}
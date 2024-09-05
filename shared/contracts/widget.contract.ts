import { JSONAPIError } from "@shared/dto/errors/json-api.error";
import { initContract } from "@ts-rest/core";

const contract = initContract();
export const widgetContract = contract.router({
    baseWidgets: {
        method: 'GET',
        path: '/widgets',
        responses: {
            200: null,
            400: contract.type<JSONAPIError>(),
        }
    },
    customWidgets: {
        method: 'GET',
        path: '/widgets/custom',
        responses: {
            200: null,
            400: contract.type<JSONAPIError>(),
        }
    }
})
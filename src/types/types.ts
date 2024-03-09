import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';

export type ControllerType = (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;

export interface NewUserRequestBody {
	name: string;
	email: string;
	photo: string;
	_id: string;
}

export interface NewProductRequestBody {
	name: string;
	price: number;
	stock: number;
	category: string;
	description: string;
}

export interface NewCartItemRequestBody {
	productId: string;
	quantity: number;
}

export interface NewCategoryRequestBody {
	name: string;
}

export type ShippingInfoType = {
	address: string;
	city: string;
	state: string;
	country: string;
	pincode: number;
};

export type OrderItemType = {
	product: string;
	quantity: number;
};

export interface NewOrderRequestBody {
	shippingInfo: ShippingInfoType;
	user: string;
	subtotal: number;
	tax: number;
	shippingCharges: number;
	total: number;
	orderItems: [OrderItemType];
}

export type UserType = {
	_id: Types.ObjectId;
	name: string;
	role: string;
	photo: string;
	email: string;
};

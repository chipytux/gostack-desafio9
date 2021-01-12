import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer does not exists');
    }

    const productStoredList = await this.productsRepository.findAllById(
      products,
    );

    if (productStoredList.length !== products.length) {
      throw new AppError('One of the products on the lista does not exist');
    }

    const formatedProduct = productStoredList.map(product => {
      const quantity =
        products.find(prod => product.id === prod.id)?.quantity || 0;
      if (quantity > product.quantity) {
        throw new AppError('There are no products enougth to make this order');
      }

      return { product_id: product.id, price: product.price, quantity };
    });

    const order = await this.ordersRepository.create({
      customer,
      products: formatedProduct,
    });

    // ATUALIZA QUANTIDADE DE CADA PRODUTO INSERIDO NO PEDIDO
    await this.productsRepository.updateQuantity(products);

    return order;
  }
}

export default CreateOrderService;

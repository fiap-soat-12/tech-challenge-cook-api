import { OrderStatusEnum } from '@application/enums/order-status.enum';
import { UUID } from '@application/types/UUID.type';
import { UpdateOrderStatusUseCase } from '@application/usecases/order/update-order-status/update-order-status.usecase';
import { OrderNotFoundException } from '@domain/exceptions/order-not-found.exception';
import { Erros4xx5xxResponse } from '@infrastructure/entrypoint/response/errors-4xx-5xx.response';
import { UUIDValidationPipe } from '@infrastructure/entrypoint/validators/null-or-valid-uuid/null-or-valid-uuid.validator';
import { Controller, HttpException, Param, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Order')
@ApiBearerAuth('Authorization')
@Controller('orders')
export class UpdateOrderStatusController {
  constructor(private readonly usecase: UpdateOrderStatusUseCase) {}

  @Patch(':id/status/:status')
  @ApiOperation({ summary: 'Update Order Status' })
  @ApiResponse({
    status: 200,
    description: 'Order status updated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: Erros4xx5xxResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
    type: Erros4xx5xxResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: Erros4xx5xxResponse,
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the order to update',
    example: 'a6b9e046-fb5a-4a79-9d86-363e6fd20e11',
    type: 'string',
  })
  @ApiParam({
    name: 'status',
    description: 'New status of the order',
    example: 'READY',
    enum: OrderStatusEnum,
  })
  async updateOrderStatus(
    @Param('id', UUIDValidationPipe) id: UUID,
    @Param('status') status: OrderStatusEnum,
  ): Promise<void> {
    try {
      await this.usecase.execute(id, status);
    } catch (error) {
      if (error instanceof OrderNotFoundException) {
        throw new HttpException(error.message, 404);
      }
      throw new HttpException(error.message, 500);
    }
  }
}

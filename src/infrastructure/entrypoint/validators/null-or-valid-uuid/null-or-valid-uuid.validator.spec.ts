import { NullOrValidUUIDConstraint } from './null-or-valid-uuid.validator';

describe('NullOrValidUUIDConstraint', () => {
  let validator: NullOrValidUUIDConstraint;

  beforeEach(() => {
    validator = new NullOrValidUUIDConstraint();
  });

  it('deve retornar true para null', () => {
    expect(validator.validate(null)).toBe(true);
  });

  it('deve retornar true para undefined', () => {
    expect(validator.validate(undefined)).toBe(true);
  });

  it('deve retornar true para um UUID válido', () => {
    expect(validator.validate('550e8400-e29b-41d4-a716-446655440000')).toBe(
      true,
    );
  });

  it('deve retornar false para um UUID inválido', () => {
    expect(validator.validate('invalid-uuid')).toBe(false);
  });

  it('deve retornar false para um número', () => {
    expect(validator.validate(12345 as any)).toBe(false);
  });

  it('deve retornar false para um objeto', () => {
    expect(validator.validate({} as any)).toBe(false);
  });

  it('deve retornar false para um array', () => {
    expect(validator.validate([] as any)).toBe(false);
  });
});

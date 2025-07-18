// src/components/OrcamentoForm.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { Calculator, FormField } from '@/data/servicesData'; // Importe os tipos que criamos

interface OrcamentoFormProps {
  calculator: Calculator;
}

const OrcamentoForm: React.FC<OrcamentoFormProps> = ({ calculator }) => {
  // Inicializa o estado do formulário com os valores padrão
  const getInitialValues = () => {
    return calculator.fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue;
      return acc;
    }, {} as { [key: string]: any });
  };

  const [formValues, setFormValues] = useState(getInitialValues);
  const [orcamento, setOrcamento] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Converte para número se o input for do tipo 'number'
    const finalValue = type === 'number' ? parseFloat(value) : value;
    setFormValues(prev => ({ ...prev, [name]: finalValue }));
  };

  // Recalcula o orçamento sempre que os valores do formulário mudarem
  useEffect(() => {
    const result = calculator.formula(formValues);
    setOrcamento(result);
  }, [formValues, calculator.formula]);

  const renderField = (field: FormField) => {
    const commonProps = {
      name: field.name,
      id: field.name,
      value: formValues[field.name] || '',
      onChange: handleChange,
      className: "mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm",
    };

    switch (field.type) {
      case 'number':
        return <input type="number" {...commonProps} style={{ color: 'black' }} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm" />
      case 'select':
        return (
          <select {...commonProps} style={{ color: 'black' }} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm">
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-slate-200">
      <h4 className="text-lg font-semibold text-slate-700">Calcular Orçamento Estimado</h4>
      <div className="mt-4 space-y-4">
        {calculator.fields.map(field => (
          <div key={field.name}>
            <label htmlFor={field.name} style={{ color: 'black' }} className="block text-sm font-medium text-slate-600">
              {field.label}
            </label>
            {renderField(field)}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-center">
        <p style={{ color: 'black' }} className="text-sm font-medium text-yellow-800">Valor Estimado:</p>
        <p style={{ color: 'black' }} className="text-3xl font-bold text-yellow-900">
          {orcamento !== null ? orcamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Preencha os campos'}
        </p>
        <p className="text-xs text-yellow-700 mt-1">Este valor é uma estimativa e pode variar.</p>
      </div>
    </div>
  );
};

export default OrcamentoForm;
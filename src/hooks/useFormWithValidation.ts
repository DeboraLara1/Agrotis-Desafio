import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormData, Propriedade } from '../types';

type FormSchema = {
  nome: string;
  dataInicial: string;
  dataFinal: string;
  propriedades: Propriedade[];
  laboratorio: { id: number; nome: string };
  observacoes: string | null;
};

const schema = yup.object().shape({
  nome: yup.string().required('O nome é obrigatório'),
  dataInicial: yup.string().required('A data inicial é obrigatória'),
  dataFinal: yup.string().required('A data final é obrigatória'),
  propriedades: yup.array().min(1, 'Selecione pelo menos uma propriedade'),
  laboratorio: yup.mixed().test(
    'is-valid-lab',
    'Selecione um laboratório',
    (value) => {
      if (!value) return false;
      
      if (typeof value === 'object') {
        const lab = value as { id?: number; nome?: string };
        return !!lab.id && !!lab.nome;
      }
      
      return false;
    }
  ),
  observacoes: yup.string().nullable()
});

const useFormWithValidation = (initialData?: FormData) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    control, 
    setValue,
    watch,
    reset
  } = useForm<FormData>({
    // @ts-ignore - Ignora erros de tipo no resolver do yup
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      nome: '',
      dataInicial: new Date().toISOString().split('T')[0],
      dataFinal: new Date().toISOString().split('T')[0],
      propriedades: [] as Propriedade[],
      laboratorio: undefined as any,
      observacoes: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    watch,
    reset
  };
};

export default useFormWithValidation; 
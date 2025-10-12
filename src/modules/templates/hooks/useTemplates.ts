/**
 * Template Hooks
 * React hooks for template operations following useAuth pattern
 * Provides CRUD operations for all template types
 */

import { useQueryClient } from '@tanstack/react-query';
import { useApiGet, useApiPost } from '@/hooks/api';
import {
  AdviceTemplate,
  ComplaintTemplate,
  ExaminationTemplate,
  ProcedureTemplate,
  MedicineTemplate,
  MedicinePackageTemplate,
  CreateAdviceTemplate,
  CreateComplaintTemplate,
  CreateExaminationTemplate,
  CreateProcedureTemplate,
  CreateMedicineTemplate,
  CreateMedicinePackageTemplate,
  UpdateAdviceTemplate,
  UpdateComplaintTemplate,
  UpdateExaminationTemplate,
  UpdateProcedureTemplate,
  UpdateMedicineTemplate,
  UpdateMedicinePackageTemplate,
  TemplateType,
} from '../types/template.types';

// ============================================
// QUERY KEYS
// ============================================

const getTemplateQueryKey = (type: TemplateType) => ['templates', type];
const getTemplateByIdQueryKey = (type: TemplateType, id: string) => ['templates', type, id];

// ============================================
// ADVICE TEMPLATE HOOKS
// ============================================

export const useAdviceTemplates = () => {
  return useApiGet<AdviceTemplate[]>(getTemplateQueryKey('advice'), 'clinic-template/advice', {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAdviceTemplate = (id: string) => {
  return useApiGet<AdviceTemplate>(
    getTemplateByIdQueryKey('advice', id),
    `clinic-template/advice/${id}`,
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    }
  );
};

export const useCreateAdviceTemplate = () => {
  const queryClient = useQueryClient();

  return useApiPost<AdviceTemplate, CreateAdviceTemplate>('clinic-template/advice', 'POST', {
    successMessage: 'Advice template created successfully!',
    onSuccess: () => {
      // Invalidate and refetch advice templates
      queryClient.invalidateQueries({ queryKey: getTemplateQueryKey('advice') });
    },
  });
};

export const useUpdateAdviceTemplate = () => {
  const queryClient = useQueryClient();

  return useApiPost<void, { data: UpdateAdviceTemplate; id: string }>(
    'clinic-template/advice',
    'PATCH',
    {
      successMessage: 'Advice template updated successfully!',
      onSuccess: (data, variables) => {
        // Invalidate templates and specific template
        queryClient.invalidateQueries({ queryKey: getTemplateQueryKey('advice') });
        queryClient.invalidateQueries({
          queryKey: getTemplateByIdQueryKey('advice', variables.id),
        });
      },
      constructUrl: (variables: { data: UpdateAdviceTemplate; id: string }) =>
        `clinic-template/advice/${variables.id}`,
    }
  );
};

export const useDeleteAdviceTemplate = () => {
  const queryClient = useQueryClient();

  return useApiPost<void, string>('clinic-template/advice', 'DELETE', {
    successMessage: 'Advice template deleted successfully!',
    onSuccess: () => {
      // Invalidate advice templates
      queryClient.invalidateQueries({ queryKey: getTemplateQueryKey('advice') });
    },
    constructUrl: (id: string) => `clinic-template/advice/${id}`,
  });
};

// ============================================
// COMPLAINT TEMPLATE HOOKS
// ============================================

export const useComplaintTemplates = () => {
  return useApiGet<ComplaintTemplate[]>(
    getTemplateQueryKey('complaint'),
    'clinic-template/complaint',
    {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    }
  );
};

export const useComplaintTemplate = (id: string) => {
  return useApiGet<ComplaintTemplate>(
    getTemplateByIdQueryKey('complaint', id),
    `clinic-template/complaint/${id}`,
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    }
  );
};

export const useCreateComplaintTemplate = () => {
  const queryClient = useQueryClient();

  return useApiPost<ComplaintTemplate, CreateComplaintTemplate>(
    'clinic-template/complaint',
    'POST',
    {
      successMessage: 'Complaint template created successfully!',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getTemplateQueryKey('complaint') });
      },
    }
  );
};

export const useUpdateComplaintTemplate = () => {
  const queryClient = useQueryClient();

  return useApiPost<void, { data: UpdateComplaintTemplate; id: string }>(
    'clinic-template/complaint',
    'PATCH',
    {
      successMessage: 'Complaint template updated successfully!',
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: getTemplateQueryKey('complaint') });
        queryClient.invalidateQueries({
          queryKey: getTemplateByIdQueryKey('complaint', variables.id),
        });
      },
      constructUrl: (variables: { data: UpdateComplaintTemplate; id: string }) =>
        `clinic-template/complaint/${variables.id}`,
    }
  );
};

export const useDeleteComplaintTemplate = () => {
  const queryClient = useQueryClient();

  return useApiPost<void, string>('clinic-template/complaint', 'DELETE', {
    successMessage: 'Complaint template deleted successfully!',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getTemplateQueryKey('complaint') });
    },
    constructUrl: (id: string) => `clinic-template/complaint/${id}`,
  });
};

// ============================================
// EXAMINATION TEMPLATE HOOKS
// ============================================

export const useExaminationTemplates = () => {
  return useApiGet<ExaminationTemplate[]>(
    getTemplateQueryKey('examination'),
    'clinic-template/examination',
    {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    }
  );
};

export const useExaminationTemplate = (id: string) => {
  return useApiGet<ExaminationTemplate>(
    getTemplateByIdQueryKey('examination', id),
    `clinic-template/examination/${id}`,
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    }
  );
};

export const useCreateExaminationTemplate = () => {
  const queryClient = useQueryClient();

  return useApiPost<ExaminationTemplate, CreateExaminationTemplate>(
    'clinic-template/examination',
    'POST',
    {
      successMessage: 'Examination template created successfully!',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getTemplateQueryKey('examination') });
      },
    }
  );
};

export const useUpdateExaminationTemplate = () => {
  const queryClient = useQueryClient();

  return useApiPost<void, { data: UpdateExaminationTemplate; id: string }>(
    'clinic-template/examination',
    'PATCH',
    {
      successMessage: 'Examination template updated successfully!',
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: getTemplateQueryKey('examination') });
        queryClient.invalidateQueries({
          queryKey: getTemplateByIdQueryKey('examination', variables.id),
        });
      },
      constructUrl: (variables: { data: UpdateExaminationTemplate; id: string }) =>
        `clinic-template/examination/${variables.id}`,
    }
  );
};

export const useDeleteExaminationTemplate = () => {
  const queryClient = useQueryClient();

  return useApiPost<void, string>('clinic-template/examination', 'DELETE', {
    successMessage: 'Examination template deleted successfully!',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getTemplateQueryKey('examination') });
    },
    constructUrl: (id: string) => `clinic-template/examination/${id}`,
  });
};

// ============================================
// PROCEDURE TEMPLATE HOOKS
// ============================================

export const useProcedureTemplates = () => {
  return useApiGet<ProcedureTemplate[]>(
    getTemplateQueryKey('procedure'),
    'clinic-template/procedure',
    {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    }
  );
};

export const useProcedureTemplate = (id: string) => {
  return useApiGet<ProcedureTemplate>(
    getTemplateByIdQueryKey('procedure', id),
    `clinic-template/procedure/${id}`,
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    }
  );
};

export const useCreateProcedureTemplate = () => {
  const queryClient = useQueryClient();

  return useApiPost<ProcedureTemplate, CreateProcedureTemplate>(
    'clinic-template/procedure',
    'POST',
    {
      successMessage: 'Procedure template created successfully!',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getTemplateQueryKey('procedure') });
      },
    }
  );
};

export const useUpdateProcedureTemplate = () => {
  const queryClient = useQueryClient();

  return useApiPost<void, { data: UpdateProcedureTemplate; id: string }>(
    'clinic-template/procedure',
    'PATCH',
    {
      successMessage: 'Procedure template updated successfully!',
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: getTemplateQueryKey('procedure') });
        queryClient.invalidateQueries({
          queryKey: getTemplateByIdQueryKey('procedure', variables.id),
        });
      },
      constructUrl: (variables: { data: UpdateProcedureTemplate; id: string }) =>
        `clinic-template/procedure/${variables.id}`,
    }
  );
};

export const useDeleteProcedureTemplate = () => {
  const queryClient = useQueryClient();

  return useApiPost<void, string>('clinic-template/procedure', 'DELETE', {
    successMessage: 'Procedure template deleted successfully!',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getTemplateQueryKey('procedure') });
    },
    constructUrl: (id: string) => `clinic-template/procedure/${id}`,
  });
};

// ============================================
// MEDICINE TEMPLATE HOOKS
// ============================================

export const useMedicineTemplates = () => {
  return useApiGet<MedicineTemplate[]>(
    getTemplateQueryKey('medicine'),
    'clinic-template/medicine',
    {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    }
  );
};

export const useMedicineTemplate = (id: string) => {
  return useApiGet<MedicineTemplate>(
    getTemplateByIdQueryKey('medicine', id),
    `clinic-template/medicine/${id}`,
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    }
  );
};

export const useCreateMedicineTemplate = () => {
  const queryClient = useQueryClient();

  return useApiPost<MedicineTemplate, CreateMedicineTemplate>('clinic-template/medicine', 'POST', {
    successMessage: 'Medicine template created successfully!',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getTemplateQueryKey('medicine') });
    },
  });
};

export const useUpdateMedicineTemplate = () => {
  const queryClient = useQueryClient();

  return useApiPost<void, { data: UpdateMedicineTemplate; id: string }>(
    'clinic-template/medicine',
    'PATCH',
    {
      successMessage: 'Medicine template updated successfully!',
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: getTemplateQueryKey('medicine') });
        queryClient.invalidateQueries({
          queryKey: getTemplateByIdQueryKey('medicine', variables.id),
        });
      },
      constructUrl: (variables: { data: UpdateMedicineTemplate; id: string }) =>
        `clinic-template/medicine/${variables.id}`,
    }
  );
};

export const useDeleteMedicineTemplate = () => {
  const queryClient = useQueryClient();

  return useApiPost<void, string>('clinic-template/medicine', 'DELETE', {
    successMessage: 'Medicine template deleted successfully!',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getTemplateQueryKey('medicine') });
    },
    constructUrl: (id: string) => `clinic-template/medicine/${id}`,
  });
};

// ============================================
// MEDICINE PACKAGE TEMPLATE HOOKS
// ============================================

export const useMedicinePackageTemplates = () => {
  return useApiGet<MedicinePackageTemplate[]>(
    getTemplateQueryKey('medicine-package'),
    'clinic-template/medicine-package',
    {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    }
  );
};

export const useMedicinePackageTemplate = (id: string) => {
  return useApiGet<MedicinePackageTemplate>(
    getTemplateByIdQueryKey('medicine-package', id),
    `clinic-template/medicine-package/${id}`,
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    }
  );
};

export const useCreateMedicinePackageTemplate = () => {
  const queryClient = useQueryClient();

  return useApiPost<MedicinePackageTemplate, CreateMedicinePackageTemplate>(
    'clinic-template/medicine-package',
    'POST',
    {
      successMessage: 'Medicine package template created successfully!',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getTemplateQueryKey('medicine-package') });
      },
    }
  );
};

export const useUpdateMedicinePackageTemplate = () => {
  const queryClient = useQueryClient();

  return useApiPost<void, { data: UpdateMedicinePackageTemplate; id: string }>(
    'clinic-template/medicine-package',
    'PATCH',
    {
      successMessage: 'Medicine package template updated successfully!',
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: getTemplateQueryKey('medicine-package') });
        queryClient.invalidateQueries({
          queryKey: getTemplateByIdQueryKey('medicine-package', variables.id),
        });
      },
      constructUrl: (variables: { data: UpdateMedicinePackageTemplate; id: string }) =>
        `clinic-template/medicine-package/${variables.id}`,
    }
  );
};

export const useDeleteMedicinePackageTemplate = () => {
  const queryClient = useQueryClient();

  return useApiPost<void, string>('clinic-template/medicine-package', 'DELETE', {
    successMessage: 'Medicine package template deleted successfully!',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getTemplateQueryKey('medicine-package') });
    },
    constructUrl: (id: string) => `clinic-template/medicine-package/${id}`,
  });
};

export const useDeleteInstruction = () => {
  const queryClient = useQueryClient();

  return useApiPost<void, string>('clinic-template/instruction', 'DELETE', {
    successMessage: 'Instruction deleted successfully!',
    onSuccess: () => {
      // Invalidate procedure templates to refresh the data
      queryClient.invalidateQueries({ queryKey: getTemplateQueryKey('procedure') });
    },
    constructUrl: (id: string) => `clinic-template/instruction/${id}`,
  });
};

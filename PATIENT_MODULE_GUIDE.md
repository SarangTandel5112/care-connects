# Complete Patient Module Implementation Guide

This guide shows you how to create a complete module using Next.js API routes, custom hooks, and React Query. The patient module serves as a template for other modules.

## 🏗️ **Module Structure**

```
src/
├── types/
│   └── patient.ts                    # Patient TypeScript types
├── app/api/patients/
│   ├── route.ts                      # GET /api/patients, POST /api/patients
│   └── [id]/route.ts                 # GET /api/patients/[id], PUT /api/patients/[id], DELETE /api/patients/[id]
└── modules/patient/
    ├── hooks/
    │   └── usePatient.ts             # Custom hooks for patient operations
    ├── services/
    │   └── patient.service.ts        # API service functions
    ├── schemas/
    │   └── patient.schema.ts         # Zod validation schemas
    ├── components/
    │   └── PatientsList.tsx          # Example components
    └── index.ts                      # Barrel exports
```

## 🔧 **Implementation Steps**

### **1. Create Types (`src/types/patient.ts`)**

```typescript
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  // ... other fields
}

export interface CreatePatientData {
  firstName: string;
  lastName: string;
  // ... other fields
}
```

### **2. Create API Routes (`src/app/api/patients/route.ts`)**

```typescript
// GET /api/patients - List patients with pagination/filtering
export async function GET(request: NextRequest) {
  // Parse query parameters
  // Filter and paginate data
  // Return JSON response
}

// POST /api/patients - Create new patient
export async function POST(request: NextRequest) {
  // Validate request body
  // Create patient in database
  // Return created patient
}
```

### **3. Create Individual Resource Routes (`src/app/api/patients/[id]/route.ts`)**

```typescript
// GET /api/patients/[id] - Get specific patient
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Find patient by ID
  // Return patient data
}

// PUT /api/patients/[id] - Update patient
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  // Validate request body
  // Update patient in database
  // Return updated patient
}

// DELETE /api/patients/[id] - Delete patient
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Soft delete or hard delete
  // Return success response
}
```

### **4. Create Service Functions (`src/modules/patient/services/patient.service.ts`)**

```typescript
export const getPatientsAPI = async (
  params?: PatientSearchParams
): Promise<PatientListResponse> => {
  const response = await Axios.get<ApiResponse<PatientListResponse>>('/api/patients', { params });
  return response.data.data;
};

export const createPatientAPI = async (data: CreatePatientData): Promise<Patient> => {
  const response = await Axios.post<ApiResponse<Patient>>('/api/patients', data);
  return response.data.data;
};
```

### **5. Create Custom Hooks (`src/modules/patient/hooks/usePatient.ts`)**

```typescript
export const usePatients = (params?: PatientSearchParams) => {
  return useNextApiPaginatedQuery([QUERY_KEYS.PATIENT.GET_ALL_PATIENTS], '/api/patients', {
    page: params?.page || 1,
    limit: params?.limit || 10,
    requireAuth: true,
  });
};

export const useCreatePatient = () => {
  return useNextApiMutation<Patient, CreatePatientData>('/api/patients', 'POST', {
    successMessage: 'Patient created successfully!',
    invalidateQueries: [QUERY_KEYS.PATIENT.GET_ALL_PATIENTS],
  });
};
```

### **6. Create Validation Schemas (`src/modules/patient/schemas/patient.schema.ts`)**

```typescript
export const createPatientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  // ... other validations
});

export type CreatePatientFormData = z.infer<typeof createPatientSchema>;
```

### **7. Create Components (`src/modules/patient/components/PatientsList.tsx`)**

```typescript
export default function PatientsListPage() {
  const { data: patientsData, isLoading } = usePatients(searchParams);
  const createPatientMutation = useCreatePatient();

  return (
    <div>
      {/* Patient list UI */}
      {/* Create/edit forms */}
      {/* Pagination */}
    </div>
  );
}
```

## 📝 **Usage Examples**

### **Basic CRUD Operations**

#### **1. List Patients with Pagination**

```tsx
import { usePatients } from '@/modules/patient';

function PatientsList() {
  const { data, isLoading, error } = usePatients({
    page: 1,
    limit: 10,
    search: 'john',
    status: 'active',
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {data?.patients?.map((patient) => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  );
}
```

#### **2. Create New Patient**

```tsx
import { useCreatePatient } from '@/modules/patient';
import { useFormHandler } from '@/hooks';

function CreatePatientForm() {
  const createPatient = useCreatePatient();

  const { register, handleSubmit, isSubmitting } = useFormHandler({
    schema: createPatientSchema,
    onSubmit: async (data) => {
      await createPatient.mutateAsync(data);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <input {...register('firstName')} placeholder="First Name" />
      <input {...register('lastName')} placeholder="Last Name" />
      <input {...register('email')} placeholder="Email" />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Patient'}
      </button>
    </form>
  );
}
```

#### **3. Update Patient**

```tsx
import { useUpdatePatient } from '@/modules/patient';

function EditPatientForm({ patientId }: { patientId: string }) {
  const updatePatient = useUpdatePatient();

  const handleUpdate = async (data: UpdatePatientData) => {
    await updatePatient.mutateAsync({ ...data, id: patientId });
  };

  return <form onSubmit={handleUpdate}>{/* form fields */}</form>;
}
```

#### **4. Delete Patient**

```tsx
import { useDeletePatient } from '@/modules/patient';

function PatientActions({ patientId }: { patientId: string }) {
  const deletePatient = useDeletePatient();

  const handleDelete = () => {
    if (confirm('Are you sure?')) {
      deletePatient.mutate(patientId);
    }
  };

  return <button onClick={handleDelete}>Delete Patient</button>;
}
```

### **Advanced Features**

#### **1. Search with Debouncing**

```tsx
import { useSearchPatients } from '@/modules/patient';
import { useDebounce } from '@/hooks';

function PatientSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: searchResults } = useSearchPatients(debouncedSearch);

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search patients..."
      />
      {searchResults?.map((patient) => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  );
}
```

#### **2. Patient Statistics**

```tsx
import { usePatientStats } from '@/modules/patient';

function PatientDashboard() {
  const { totalActive, totalInactive, totalArchived, total } = usePatientStats();

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard title="Total" value={total} />
      <StatCard title="Active" value={totalActive} />
      <StatCard title="Inactive" value={totalInactive} />
      <StatCard title="Archived" value={totalArchived} />
    </div>
  );
}
```

#### **3. Real-time Updates**

```tsx
import { usePatients } from '@/modules/patient';

function LivePatientsList() {
  const { data } = usePatients(
    {
      page: 1,
      limit: 50,
    },
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      staleTime: 15000, // Consider stale after 15 seconds
    }
  );

  return (
    <div>
      {data?.patients?.map((patient) => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  );
}
```

## 🔄 **API Route Patterns**

### **Query Parameters for Filtering**

```
GET /api/patients?search=john&status=active&gender=male&page=1&limit=10&sortBy=firstName&sortOrder=asc
```

### **Response Format**

```json
{
  "success": true,
  "data": {
    "patients": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### **Error Response Format**

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

## 🎯 **Best Practices**

### **1. Consistent Error Handling**

```typescript
// In API routes
try {
  // operation
} catch (error) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        success: false,
        message: 'Validation error',
        errors: error.errors,
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: 'Internal server error',
    },
    { status: 500 }
  );
}
```

### **2. Proper Validation**

```typescript
// Always validate input
const validatedData = schema.parse(requestBody);

// Check for duplicates
const existing = await findExisting(validatedData.email);
if (existing) {
  return NextResponse.json(
    {
      success: false,
      message: 'Resource already exists',
    },
    { status: 409 }
  );
}
```

### **3. Optimistic Updates**

```typescript
const updatePatient = useUpdatePatient({
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['patients']);

    // Snapshot previous value
    const previousPatients = queryClient.getQueryData(['patients']);

    // Optimistically update
    queryClient.setQueryData(['patients'], (old) => ({
      ...old,
      patients: old.patients.map((p) => (p.id === newData.id ? { ...p, ...newData } : p)),
    }));

    return { previousPatients };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['patients'], context.previousPatients);
  },
});
```

### **4. Proper Loading States**

```typescript
function PatientForm() {
  const { data: patient, isLoading } = usePatient(patientId);

  if (isLoading) return <PatientFormSkeleton />;
  if (!patient) return <NotFound />;

  return <PatientFormContent patient={patient} />;
}
```

## 🚀 **Performance Optimizations**

### **1. Pagination**

- Always implement pagination for large datasets
- Use cursor-based pagination for better performance
- Implement infinite scroll for better UX

### **2. Caching Strategy**

```typescript
const { data } = usePatients(params, {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
});
```

### **3. Background Updates**

```typescript
const { data } = usePatients(params, {
  refetchInterval: 60000, // 1 minute
  refetchIntervalInBackground: true,
});
```

### **4. Request Deduplication**

- React Query automatically deduplicates identical requests
- Use consistent query keys for better caching

## 📊 **Module Template**

Use this patient module as a template for other modules:

1. **Copy the structure** to create new modules
2. **Update types** for your specific domain
3. **Modify API routes** for your business logic
4. **Customize hooks** for your specific needs
5. **Create components** for your UI requirements

This pattern provides:

- ✅ **Type Safety** - Full TypeScript support
- ✅ **Validation** - Zod schemas for all inputs
- ✅ **Caching** - Automatic React Query caching
- ✅ **Error Handling** - Consistent error management
- ✅ **Loading States** - Built-in loading indicators
- ✅ **Optimistic Updates** - Better user experience
- ✅ **Real-time Sync** - Background data updates

The patient module demonstrates the complete integration of Next.js API routes with React Query and custom hooks, providing a robust foundation for building scalable applications.

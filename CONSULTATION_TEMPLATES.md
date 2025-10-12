# Consultation Templates Implementation

## Overview

Successfully implemented predefined template functionality for the consultation module. Templates allow doctors to quickly select common complaints, examinations, advice, procedures, and medicines instead of typing everything from scratch.

## What Was Implemented

### 1. Template Types (`src/modules/consultation/types/template.types.ts`)

Created TypeScript interfaces for all template types:

- **ComplaintTemplate**: `{ id, name, description, clinicId }`
- **ExaminationTemplate**: `{ id, name, description, clinicId }`
- **AdviceTemplate**: `{ id, name, description, clinicId }`
- **ProcedureTemplate**: `{ id, name, note, unitCost, clinicId, instructions[] }`
- **MedicineTemplate**: `{ id, name, type, strength, unit, company, duration, durationType, morning, noon, evening, note, clinicId }`

### 2. Template Hooks (`src/modules/consultation/hooks/useTemplates.ts`)

Created React Query hooks for fetching templates:

- `useComplaintTemplates(filters?)` - Fetches complaint templates
- `useExaminationTemplates(filters?)` - Fetches examination templates
- `useAdviceTemplates(filters?)` - Fetches advice templates
- `useProcedureTemplates(filters?)` - Fetches procedure templates
- `useMedicineTemplates(filters?)` - Fetches medicine templates

**Features:**
- Clinic-specific filtering via query params
- Optimized caching (10-minute stale time, 15-minute GC time)
- Automatic query key generation

### 3. Reusable TemplateSelector Component (`src/modules/consultation/components/TemplateSelector.tsx`)

Generic component for displaying templates in a searchable list:

**Features:**
- Search functionality with real-time filtering
- Loading states with Ant Design Spin
- Empty states with appropriate messages
- Displays template count
- Click to select template
- Customizable height and placeholder
- Generic type support for any template type

**UI Layout:**
- Search input at top
- Scrollable list of templates
- Template count footer
- 400px default height (customizable)

### 4. BasicInfoSection Updates

**Added template selectors for:**
1. **Chief Complaints** - Left side shows complaint templates
2. **Clinical Examination Findings** - Left side shows examination templates
3. **Advice & Recommendations** - Left side shows advice templates

**Layout:**
- **Left (md:w-3/12, min-w-300px)**: TemplateSelector with searchable list
- **Right (flex-1)**: TextArea field for input

**Behavior:**
- When template is clicked, its description is **appended** to current field value
- Allows building complex descriptions by combining multiple templates
- TextArea increased to 7 rows with min-height 400px to match template selector

**Integration:**
- Fetches templates using React Query hooks
- Uses `useCallback` for performance optimization
- Displays loading states while fetching

### 5. ProceduresSection Updates

**Added template selector in Add/Edit Procedure Modal:**

**Features:**
- Dropdown select at top of modal (blue background)
- Shows procedure name, unit cost, and note preview
- Searchable select with all procedure templates
- When selected, auto-fills:
  - Procedure name
  - Unit cost
  - Note (if available)

**User can then modify:**
- Quantity
- Discount
- Teeth numbers
- Add custom note

### 6. PrescriptionsSection Updates

**Added template selector in Add/Edit Prescription Modal:**

**Features:**
- Dropdown select at top of modal (green background)
- Shows medicine name, type, and strength
- Searchable select with all medicine templates
- When selected, auto-fills:
  - Medicine name
  - Type (tablet, capsule, syrup, etc.)
  - Strength and unit
  - Company
  - Duration and duration type
  - Dosage schedule (morning, noon, evening)
  - Instructions/notes

**User can then modify any field as needed.**

## Backend API Endpoints Used

The implementation uses the existing template module API endpoints:

```
GET /clinic-template/advice
GET /clinic-template/complaint
GET /clinic-template/examination
GET /clinic-template/procedure
GET /clinic-template/medicine
```

These endpoints are already implemented in the backend `clinic-template` module.

## Files Created

1. `src/modules/consultation/components/TemplateSelector.tsx` - Reusable template selector UI component

**Note:** This implementation uses the existing templates module at `src/modules/templates/` which already has:
- Template types (`src/modules/templates/types/template.types.ts`)
- Template hooks (`src/modules/templates/hooks/useTemplates.ts`)
- Backend API integration

## Files Modified

1. `src/modules/consultation/components/BasicInfoSection.tsx` - Added complaint, examination, and advice templates
2. `src/modules/consultation/components/ProceduresSection.tsx` - Added procedure templates in modal
3. `src/modules/consultation/components/PrescriptionsSection.tsx` - Added medicine templates in modal

All components import templates from the existing `@/modules/templates` module.

## User Experience

### For Complaints, Examination, and Advice:
1. Doctor sees template list on the left side
2. Can search templates by name or description
3. Clicks on a template to add it to the field
4. Template description is appended to current text (with newline)
5. Can select multiple templates to build complex descriptions
6. Can edit the text after adding templates

### For Procedures:
1. Doctor clicks "Add Procedure"
2. Modal opens with template selector at top
3. Can search and select a procedure template
4. Template auto-fills name and unit cost
5. Doctor modifies quantity, discount, teeth numbers as needed
6. Subtotal is calculated automatically

### For Medicines:
1. Doctor clicks "Add Medicine"
2. Modal opens with template selector at top
3. Can search and select a medicine template
4. Template auto-fills all medicine details including dosage schedule
5. Doctor can modify any field (dosage, duration, notes, etc.)
6. Saves complete prescription

## Design Pattern

The implementation follows the same pattern as the old frontend:

```
Old Frontend: CUSTOMSELECTWITHFORMFIELD
├── Left: Select dropdown with templates (3/12 width)
└── Right: Form field (flex-1)

New Frontend: TemplateSelector + TextArea
├── Left: TemplateSelector component (md:w-3/12)
└── Right: TextArea field (flex-1)
```

## Performance Optimizations

1. **React Query Caching**: Templates cached for 10 minutes (rarely change)
2. **useCallback**: Template selection handlers wrapped in useCallback
3. **useMemo**: Search filtering uses useMemo in TemplateSelector
4. **Lazy Loading**: Templates only fetched when section is rendered
5. **Generic Component**: TemplateSelector is reusable across all template types

## Next Steps (Optional Enhancements)

1. **Add template management page**: Allow doctors to create/edit/delete templates
2. **Template categories**: Group templates by specialty or condition
3. **Favorite templates**: Allow marking frequently used templates
4. **Recent templates**: Show recently used templates first
5. **Template packages**: Pre-defined sets of templates for common diagnoses
6. **Template sharing**: Share templates across clinics

## Testing Checklist

- [ ] Complaint templates load and are searchable
- [ ] Examination templates load and are searchable
- [ ] Advice templates load and are searchable
- [ ] Procedure templates load in modal dropdown
- [ ] Medicine templates load in modal dropdown
- [ ] Selecting complaint template appends to field
- [ ] Selecting examination template appends to field
- [ ] Selecting advice template appends to field
- [ ] Selecting procedure template fills name and unitCost
- [ ] Selecting medicine template fills all fields
- [ ] Search functionality works in all template selectors
- [ ] Loading states display correctly
- [ ] Empty states display when no templates
- [ ] Templates can be combined (multiple selections for text fields)
- [ ] Manual editing works after template selection
- [ ] Form submission includes template-filled data

## Notes

- All templates are clinic-specific (filtered by clinicId if provided)
- Template selection is **additive** for text fields (complaints, examination, advice)
- Template selection **replaces** fields for structured data (procedures, medicines)
- Search is case-insensitive and searches both name and description/details
- Templates are optional - doctors can still manually enter everything

import type {EmployeeFormOneData} from "@/types/employee"
import { create } from "zustand";

interface employeeFormOneState {
    formOne: EmployeeFormOneData | null;
    setFormOne: (formOne: EmployeeFormOneData | null) => void
}

export const useEmployeeFormOneStore = create<employeeFormOneState>()(
    (set) => ({
      formOne: null, // Default state is null
      setFormOne: (formOne) => set({ formOne }), // Update form One 
    }),
)
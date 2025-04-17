import React, { createContext, useContext, useState } from "react";

export interface ComplaintHistoryItem {
  id: string;
  title: string;
  description: string;
  status: string;
  date: string; // ISO string
}

interface ComplaintContextType {
  complaints: ComplaintHistoryItem[];
  addComplaint: (complaint: ComplaintHistoryItem) => void;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const useComplaintContext = () => {
  const ctx = useContext(ComplaintContext);
  if (!ctx) throw new Error("useComplaintContext must be used within ComplaintProvider");
  return ctx;
};

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<ComplaintHistoryItem[]>([]);

  const addComplaint = (complaint: ComplaintHistoryItem) => {
    setComplaints(prev =>
      [complaint, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  };

  return (
    <ComplaintContext.Provider value={{ complaints, addComplaint }}>
      {children}
    </ComplaintContext.Provider>
  );
};

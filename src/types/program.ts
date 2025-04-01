export type Initiative = {
  id: string;
  type: "VOLUNTEER" | "FUNDRAISE";
  goal: string;
  startDate: string;
  endDate: string;
  status: "PLANNED" | "ONGOING" | "COMPLETED";
};

export type Support = {
  id: string;
  programId: string;
  corporateId: string;
  message: string;
  supportedAt: string;
  corporate: {
    // The corporate details from join; required
    email: string;
    name: string;
  };
};

export type Program = {
  id: string;
  title: string;
  description: string;
  sdgGoal: string;
  createdAt: string;
  initiatives: Initiative[];
  supports: Support[]; // Now supports is included
};

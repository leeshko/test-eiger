type SendMessage = {
  type: "SendSMS" | "SendEmail" | "DoNothing";
  phoneNumber?: string;
  sender?: string;
  receiver?: string;
  message?: string;
};

type PayloadType = {
  type: "Condition" | "Loop" | "Sequence";
  condition?: string;
  iterations?: number;
  trueAction?: SendMessage;
  falseAction?: SendMessage;
  actions?: SendMessage[];
  subtree?: PayloadType;
};

export const condition: PayloadType = {
  type: "Condition",
  condition:
    "new Date().getDate() === 1 && new Date().getMonth() === 0 && new Date().getFullYear() === 2025",
  trueAction: {
    type: "SendSMS",
    phoneNumber: "+11111111111",
    message: "Happy New Year!",
  },
  falseAction: { type: "DoNothing" },
  actions: [],
};

export const sequence: PayloadType = {
  type: "Sequence",
  trueAction: { type: "DoNothing" },
  falseAction: { type: "DoNothing" },
  actions: [
    {
      type: "SendEmail",
      sender: "sender-1@mail.com",
      receiver: "receiver-1@mail.com",
      message: "1st: Email",
    },
    {
      type: "SendSMS",
      phoneNumber: "+2222222222",
      message: "2nd: SMS!",
    },
    {
      type: "SendEmail",
      sender: "sender-3@mail.com",
      receiver: "receiver-3@mail.com",
      message: "3rd: Email",
    },
  ],
};

export const loop: PayloadType = {
  type: "Loop",
  iterations: 5,
  subtree: {
    type: "Condition",
    condition: "Math.random() > 0.5",
    trueAction: {
      type: "SendSMS",
      phoneNumber: "+555555555",
      message: "True Action: sending SMS",
    },
    falseAction: {
      type: "DoNothing",
    },
  },
};

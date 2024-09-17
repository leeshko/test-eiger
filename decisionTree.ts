export interface ActionNode {
  execute(): void;
  serialize(): SerializedNode;
}

type SerializedNode = {
  type: string;
  [key: string]: any;
};

export class DoNothing implements ActionNode {
  execute() {
    console.log("Doing nothing.");
  }

  serialize(): SerializedNode {
    return {
      type: "DoNothing",
    };
  }
}

export class SendSms implements ActionNode {
  constructor(private phoneNumber: string, private text: string) {
    this.phoneNumber = phoneNumber;
    this.text = text;
  }
  execute(): void {
    console.log(`Sending SMS to ${this.phoneNumber} with text: ${this.text}`);
  }
  serialize(): SerializedNode {
    return {
      type: "SendSMS",
      phoneNumber: this.phoneNumber,
      message: this.text,
    };
  }
}

export class SendEmail implements ActionNode {
  constructor(
    private sender: string,
    private receiverAddress: string,
    private text: string
  ) {
    this.sender = sender;
    this.receiverAddress = receiverAddress;
    this.text = text;
  }
  execute(): void {
    console.log(
      `Sending Email from ${this.sender} to ${this.receiverAddress} with text ${this.text}`
    );
  }
  serialize() {
    return {
      type: "SendEmail",
      sender: this.sender,
      receiver: this.receiverAddress,
      text: this.text,
    };
  }
}

export class Condition implements ActionNode {
  constructor(
    private condition: string,
    private trueAction: ActionNode,
    private falseAction: ActionNode
  ) {}

  execute(): void {
    const expressionResult = new Function(`return ${this.condition}`)();
    expressionResult ? this.trueAction.execute() : this.falseAction.execute();

    // !!! here we evaluate expression using new Function. This method is not safe, as eval().
    // in this case its better to define some whitelist with allowed expressions
    // (there is no information about these expressions in the task description).
    // Or we can use some libraries like jexl or expr-eval
  }
  serialize(): SerializedNode {
    return {
      type: "Condition",
      condition: this.condition,
      trueAction: this.trueAction.serialize(),
      falseAction: this.falseAction.serialize(),
    };
  }
}

class Sequence implements ActionNode {
  constructor(private actions: ActionNode[]) {}

  execute() {
    this.actions.forEach((action) => action.execute());
  }

  serialize(): SerializedNode {
    return {
      type: "Sequence",
      actions: this.actions.map((action) => action.serialize()),
    };
  }
}

export class Loop implements ActionNode {
  constructor(private subtree: ActionNode, private iterations: number) {}

  execute(): void {
    for (let i = 0; i < this.iterations; i++) {
      this.subtree.execute();
    }
  }
  serialize() {
    return {
      type: "Loop",
      iterations: this.iterations,
      subtree: this.subtree.serialize(),
    };
  }
}

export class DecisionTree {
  constructor(private root: ActionNode) {
    this.root = root;
  }

  execute() {
    this.root.execute();
  }

  serialize(): SerializedNode {
    return this.root.serialize();
  }

  static deserialize(json: SerializedNode): DecisionTree {
    const node = this.deserializeNode(json);
    return new DecisionTree(node);
  }

  private static deserializeNode(json: SerializedNode): ActionNode {
    switch (json.type) {
      case "DoNothing":
        return new DoNothing();
      case "Condition":
        return new Condition(
          json.condition,
          this.deserializeNode(json.trueAction),
          this.deserializeNode(json.falseAction)
        );
      case "Loop":
        return new Loop(this.deserializeNode(json.subtree), json.iterations);
      case "Sequence":
        return new Sequence(
          json.actions.map((action: any) => this.deserializeNode(action))
        );
      case "SendSMS":
        return new SendSms(json.phoneNumber, json.message);
      case "SendEmail":
        return new SendEmail(json.sender, json.receiver, json.message);
      default:
        throw new Error("Unknown node type");
    }
  }
}

import { renderEmail } from "@maillayer/core/react";

import { email } from "./email.js";
import { WelcomeEmail } from "./ui/email/welcome.js";

const content = await renderEmail(<WelcomeEmail name="Ada" />);

await email.send({
  from: "Acme <hello@acme.com>",
  to: "ada@example.com",
  subject: "Welcome to Acme",
  ...content,
});

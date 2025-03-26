import { file } from "bun";
import { Elysia } from "elysia";

type Technology = {
  id: string[];
  name: string;
  icon: string;
  color: string;
};

const app = new Elysia();

const technologies: Technology[] = await file("./technologies.json").json();

app.get("/", () => {
  return file("./technologies.json");
});

app.get("/:id", (c) => {
  const requestedid = c.params.id.toLowerCase();

  const technology = technologies.find((item) => {
    if (item.id && Array.isArray(item.id)) {
      return item.id.includes(requestedid);
    }
    return false;
  });

  if (technology) {
    return technology;
  } else {
    c.set.status = 404;
    return { error: "Item not found" };
  }
});

app.get("/:id/icon.svg", (c) => {
  const requestedid = c.params.id.toLowerCase();

  const technology = technologies.find((item) => {
    if (item.id && Array.isArray(item.id)) {
      return item.id.includes(requestedid);
    }
    return false;
  });

  if (technology) {
    const svg = technology.icon;

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
      },
    });
  } else {
    c.set.status = 404;
    return { error: "Icon not found" };
  }
});

app.get("/view", () => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Technologies List</title>
      </head>
      <body style="background-color: #f5f5f5; font-family: system-ui">
        <h1>Technologies</h1>
        <ul>
          ${technologies
            .map(
              (tech) => `
            <li>
              <strong style="color: ${tech.color};">${tech.name}</strong>
              (${tech.id.join(", ")})
              <div style="height: 30px; width: 30px; vertical-align: middle;">
            ${tech.icon}
              </div>
            </li>
          `
            )
            .join("")}
        </ul>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
});

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

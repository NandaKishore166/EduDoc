import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";

export const downloadDOCX = async (
  title: string,
  content: string
) => {
  const children: Paragraph[] = [];

  // Document title
  children.push(
    new Paragraph({
      text: "PROJECT PROPOSAL",
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 300,
      },
    })
  );

  // Project title
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 28,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 500,
      },
    })
  );

  // Process generated content
  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      children.push(
        new Paragraph({
          spacing: {
            after: 120,
          },
        })
      );
      continue;
    }

    // Markdown heading: # Heading
    if (line.startsWith("### ")) {
      children.push(
        new Paragraph({
          text: line.replace(/^###\s*/, ""),
          heading: HeadingLevel.HEADING_3,
          spacing: {
            before: 200,
            after: 120,
          },
        })
      );
      continue;
    }

    if (line.startsWith("## ")) {
      children.push(
        new Paragraph({
          text: line.replace(/^##\s*/, ""),
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 250,
            after: 150,
          },
        })
      );
      continue;
    }

    if (line.startsWith("# ")) {
      children.push(
        new Paragraph({
          text: line.replace(/^#\s*/, ""),
          heading: HeadingLevel.HEADING_1,
          spacing: {
            before: 300,
            after: 180,
          },
        })
      );
      continue;
    }

    // Numbered headings such as:
    // 1. Introduction
    // 2. Objectives
    if (/^\d+\.\s+/.test(line)) {
      children.push(
        new Paragraph({
          text: line,
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 250,
            after: 150,
          },
        })
      );
      continue;
    }

    // Bullet points
    if (
      line.startsWith("- ") ||
      line.startsWith("* ")
    ) {
      children.push(
        new Paragraph({
          text: line.substring(2),
          bullet: {
            level: 0,
          },
          spacing: {
            after: 100,
          },
        })
      );
      continue;
    }

    // Normal paragraph
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: line,
            size: 22,
          }),
        ],
        alignment: AlignmentType.JUSTIFIED,
        spacing: {
          after: 160,
          line: 300,
        },
      })
    );
  }

  const document = new Document({
    creator: "EduDoc AI",
    title,
    description:
      "Academic document generated using EduDoc AI",
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob =
    await Packer.toBlob(document);

  const url =
    URL.createObjectURL(blob);

  const link =
  window.document.createElement("a");

link.href = url;

link.download =
  `${title
    .replace(/[^a-z0-9]/gi, "_")
    .replace(/_+/g, "_")
    .toLowerCase()}.docx`;

window.document.body.appendChild(link);

link.click();

window.document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
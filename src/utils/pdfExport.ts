import jsPDF from "jspdf";

export const downloadPDF = (
  title: string,
  content: string
) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth =
    pdf.internal.pageSize.getWidth();

  const pageHeight =
    pdf.internal.pageSize.getHeight();

  const margin = 20;
  const contentWidth =
    pageWidth - margin * 2;

  let y = 30;

  // -----------------------------
  // Title
  // -----------------------------

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);

  const titleLines =
    pdf.splitTextToSize(
      title,
      contentWidth
    );

  pdf.text(
    titleLines,
    pageWidth / 2,
    y,
    {
      align: "center",
    }
  );

  y +=
    titleLines.length * 9 + 15;

  // -----------------------------
  // Horizontal line
  // -----------------------------

  pdf.setLineWidth(0.5);

  pdf.line(
    margin,
    y,
    pageWidth - margin,
    y
  );

  y += 12;

  // -----------------------------
  // Content
  // -----------------------------

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(11);

  const paragraphs =
    content.split(/\n+/);

  for (const paragraph of paragraphs) {
    const text =
      paragraph.trim();

    if (!text) {
      y += 5;
      continue;
    }

    // Detect headings
    const isHeading =
      /^(#{1,3}\s|[0-9]+\.\s|[0-9]+\.[0-9]+\s)/.test(
        text
      );

    if (isHeading) {
      if (
        y >
        pageHeight - 35
      ) {
        pdf.addPage();
        y = 25;
      }

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(13);

      const heading =
        text.replace(
          /^#{1,3}\s*/,
          ""
        );

      const headingLines =
        pdf.splitTextToSize(
          heading,
          contentWidth
        );

      pdf.text(
        headingLines,
        margin,
        y
      );

      y +=
        headingLines.length * 7 +
        5;

      pdf.setFont(
        "helvetica",
        "normal"
      );

      pdf.setFontSize(11);

      continue;
    }

    const lines =
      pdf.splitTextToSize(
        text,
        contentWidth
      );

    for (const line of lines) {
      if (
        y >
        pageHeight - 25
      ) {
        pdf.addPage();
        y = 25;
      }

      pdf.text(
        line,
        margin,
        y
      );

      y += 6;
    }

    y += 4;
  }

  // -----------------------------
  // Page numbers
  // -----------------------------

  const pageCount =
    pdf.getNumberOfPages();

  for (
    let page = 1;
    page <= pageCount;
    page++
  ) {
    pdf.setPage(page);

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.setFontSize(9);

    pdf.text(
      `EduDoc AI  |  Page ${page} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      {
        align: "center",
      }
    );
  }

  // -----------------------------
  // Download
  // -----------------------------

  const filename =
    title
      .replace(/[^a-z0-9]/gi, "_")
      .replace(
        /_+/g,
        "_"
      )
      .toLowerCase();

  pdf.save(
    `${filename}.pdf`
  );
};
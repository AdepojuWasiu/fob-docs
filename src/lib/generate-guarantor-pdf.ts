import { PDFDocument, StandardFonts } from "pdf-lib";

type GuarantorPdfData = {
  guarantor: Record<string, unknown>;
  passport?: Buffer;
  passportMimeType?: string;
};

export async function generateGuarantorPdf({
  guarantor,
  passport,
  passportMimeType,
}: GuarantorPdfData) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  let y = page.getHeight() - 50;

  page.drawText("GUARANTOR FORM", {
    x: 40,
    y,
    size: 18,
    font: boldFont,
  });

  if (passport) {
    const isJpeg =
      passport[0] === 0xff && passport[1] === 0xd8;
    const isPng =
      passport[0] === 0x89 &&
      passport[1] === 0x50 &&
      passport[2] === 0x4e &&
      passport[3] === 0x47;

    if (!isJpeg && !isPng) {
      throw new Error(
        `Uploaded guarantor picture is not a supported JPEG or PNG image (received ${passportMimeType || "unknown"})`
      );
    }

    const image = isJpeg
      ? await pdfDoc.embedJpg(passport)
      : await pdfDoc.embedPng(passport);

    page.drawText("Passport Photograph", {
      x: 420,
      y: page.getHeight() - 50,
      size: 8,
      font: boldFont,
    });
    page.drawImage(image, {
      x: 420,
      y: page.getHeight() - 190,
      width: 125,
      height: 125,
    });
  }

  const drawField = (label: string, value: unknown) => {
    y -= 22;
    page.drawText(`${label}:`, { x: 40, y, size: 9, font: boldFont });
    page.drawText(String(value || "-"), { x: 180, y, size: 9, font });
  };

  for (const [label, key] of [
    ["Employee Name", "employeeName"],
    ["Employee Address", "employeeAddress"],
    ["Relationship", "relationship"],
    ["Years of Relationship", "yearsOfRelationship"],
    ["Guarantor Name", "firstName"],
    ["Surname", "surname"],
    ["Other Name", "otherName"],
    ["Date of Birth", "dateOfBirth"],
    ["Gender", "guarGender"],
    ["Marital Status", "maritalStatus"],
    ["State of Origin", "stateOfOrigin"],
    ["Email", "email"],
    ["Phone", "phoneNumber"],
    ["Occupation", "occupation"],
    ["Home Address", "guarHomeAddress"],
    ["Home State", "guarHomeState"],
    ["Home LGA", "guarHomeLga"],
    ["Home City", "guarHomeCity"],
    ["Office Address", "guarOfficeAddress"],
    ["Office State", "guarOfficeState"],
    ["Office LGA", "guarOfficeLga"],
    ["Office City", "guarOfficeCity"],
    ["Signature Date", "signatureDate"],
  ] as const) {
    drawField(label, guarantor[key]);
  }

  return Buffer.from(await pdfDoc.save());
}
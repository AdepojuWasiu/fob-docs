import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type EmployeeRecord = {
  [key: string]: unknown;
};

type EmployeePdfData = {
  employee: EmployeeRecord;
  passport?: Buffer;
  passportMimeType?: string;
};

export async function generateEmployeePdf({
  employee,
  passport,
  passportMimeType,
}: EmployeePdfData) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pageSize: [number, number] = [595.28, 841.89];
  let page = pdfDoc.addPage(pageSize);
  let y = 790;

  const addPage = () => {
    page = pdfDoc.addPage(pageSize);
    y = 790;
    page.drawText("EMPLOYEE BIO DATA FORM", {
      x: 40,
      y,
      size: 18,
      font: boldFont,
    });
    y -= 35;
  };

  const ensureSpace = (height: number) => {
    if (y - height < 55) {
      addPage();
    }
  };

  const drawField = (
    targetPage: typeof page,
    y: number,
    label: string,
    value: unknown
  ) => {
    targetPage.drawText(`${label}:`, { x: 40, y, size: 9, font: boldFont });
    targetPage.drawText(value ? String(value) : "-", { x: 180, y, size: 9, font });
  };

  const drawSection = (
    title: string,
    fields: [string, unknown][]
  ) => {
    ensureSpace(35 + fields.length * 18);
    page.drawText(title, { x: 40, y, size: 12, font: boldFont });
    y -= 25;
    for (const [label, value] of fields) {
      drawField(page, y, label, value);
      y -= 18;
    }
    y -= 15;
  };

  const drawDeclaration = (
    text: string
  ) => {
    ensureSpace(35);
    page.drawText(text, {
      x: 40,
      y,
      size: 8,
      font,
      maxWidth: 515,
      lineHeight: 11,
    });
    y -= 35;
  };

  page.drawText("EMPLOYEE BIO DATA FORM", {
    x: 40,
    y: 790,
    size: 18,
    font: boldFont,
  });

  y -= 35;

  drawSection("Employee Information", [
    ["First Name", employee.firstName],
    ["Last Name", employee.lastName],
    ["Middle Name", employee.middleName],
    ["Date of Birth", employee.dateOfBirth],
    ["Gender", employee.gender],
    ["NIN", employee.nin],
  ]);

  drawSection("Employment Information", [
    ["Job Title", employee.jobTitle],
    ["Employment Type", employee.employmentType],
    ["Department", employee.department],
    ["Marital Status", employee.maritalStatus],
    ["Nationality", employee.nationality],
    ["State of Origin", employee.stateOfOrigin],
  ]);

  drawSection("Contact Information", [
    ["Email", employee.email],
    ["Phone", employee.phoneNumber],
    ["Address", employee.address],
    ["State", employee.state],
    ["LGA", employee.lga],
    ["City", employee.city],
  ]);

  if (passport) {
    try {
      const isJpeg =
        passport[0] === 0xff && passport[1] === 0xd8;
      const isPng =
        passport[0] === 0x89 &&
        passport[1] === 0x50 &&
        passport[2] === 0x4e &&
        passport[3] === 0x47;

      if (!isJpeg && !isPng) {
        throw new Error(
          `Uploaded passport is not a supported JPEG or PNG image (received ${passportMimeType || "unknown"})`
        );
      }

      const image = isJpeg
        ? await pdfDoc.embedJpg(passport)
        : await pdfDoc.embedPng(passport);

      page.drawText("Passport Photograph", {
        x: 420,
        y: 790,
        size: 8,
        font: boldFont,
      });
      page.drawImage(image, {
        x: 420,
        y: 650,
        width: 125,
        height: 125,
      });
    } catch (error) {
      console.error("Unable to embed uploaded employee picture:", error);
    }
  }

  drawSection("Next of Kin", [
    ["First Name", employee.kinFirstName],
    ["Middle Name", employee.kinMiddleName],
    ["Last Name", employee.kinLastName],
    ["Gender", employee.kinGender],
    ["Relationship", employee.kinRelationship],
    ["Phone", employee.kinPhoneNumber],
    ["Second Phone", employee.kinPhoneNumberTwo],
    ["Address", employee.kinAddress],
  ]);

  drawSection("Personal Bank Details", [
    ["Name of PFA", employee.pfaName],
    ["PIN", employee.pin],
    ["Tax Identification Number (TIN)", employee.tin],
    ["Account Holder", employee.accountHolder],
    ["Bank Name", employee.bankName],
    ["Bank Account Number", employee.accountNumber],
    ["Tax ID PIN", employee.taxIdPin],
  ]);

  drawDeclaration(
    "Bank declaration: I understand that any monies due are to be paid using the bank details shown above. Should any information be incorrect, I agree to wait until refunds have been returned before a reissuing of monies is made by the company."
  );

  drawSection("Health Information", [
    ["Sickness Within The Last 30 Days", employee.sickness],
  ]);

  drawDeclaration(
    `Health declaration: I declare that the health information provided above is correct. Accepted: ${employee.sicknessCheckBox ? "Yes" : "No"}`
  );

  for (const documentPage of pdfDoc.getPages()) {
    documentPage.drawText("Generated electronically", {
      x: 40,
      y: 30,
      size: 7,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
  }

  return Buffer.from(await pdfDoc.save());
}

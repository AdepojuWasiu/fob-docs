import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { employeeFormOneSchema } from "@/utils/validation/employeeFormOne";
import { employeeFormTwoSchema } from "@/utils/validation/employeeFormTwo";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      submissionId,
      formOne,
      formTwo,
    } = body;

    if (!submissionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Submission ID is required",
        },
        { status: 400 }
      );
    }

    const validatedOne = employeeFormOneSchema.parse(formOne);

    // Files should NOT be sent to this endpoint.
    // Only non-file fields from form two.
    const validatedFormTwo = employeeFormTwoSchema
      .omit({
        picture: true,
        academicCertificate: true,
        nyscCertificate: true,
        birthCertificate: true,
        olevelCertificate: true,
        validId: true,
        otherDocuments: true,
      })
      .parse(formTwo);

    const submission = await prisma.submission.findUnique({
      where: {
        id: submissionId,
      },
    });

    if (!submission || submission.type !== "EMPLOYEE") {
      return NextResponse.json(
        {
          success: false,
          message: "Employee submission not found",
        },
        { status: 404 }
      );
    }

    await prisma.employee.create({
      data: {
        submissionId,

        firstName: validatedOne.firstName,
        lastName: validatedOne.lastName,
        middleName: validatedOne.middleName,
        dateOfBirth: validatedOne.dateOfBirth,
        gender: validatedOne.gender,
        nin: validatedOne.nin,
        jobTitle: validatedOne.jobTitle,
        employmentType: validatedOne.employmentType,
        department: validatedOne.department,
        maritalStatus: validatedOne.maritalStatus,
        nationality: validatedOne.nationality,
        stateOfOrigin: validatedOne.stateOfOrigin,

        address: validatedOne.address,
        state: validatedOne.state,
        lga: validatedOne.lga,
        city: validatedOne.city,

        email: validatedOne.email,
        phoneNumber: validatedOne.phoneNumber,
        phoneNumberTwo: validatedOne.phoneNumberTwo,

        kinFirstName: validatedOne.kinFirstName,
        kinLastName: validatedOne.kinLastName,
        kinMiddleName: validatedOne.kinMiddleName,
        kinGender: validatedOne.kinGender,
        kinAddress: validatedOne.kinAddress,
        kinRelationship: validatedOne.kinRelationship,
        kinPhoneNumber: validatedOne.kinPhoneNumber,
        kinPhoneNumberTwo: validatedOne.kinPhoneNumberTwo,

        pfaName: validatedFormTwo.pfaName,
        pin: validatedFormTwo.pin,
        tin: validatedFormTwo.tin,
        accountHolder: validatedFormTwo.accountHolder,
        bankName: validatedFormTwo.bankName,
        accountNumber: validatedFormTwo.accountNumber,
        taxIdPin: validatedFormTwo.taxIdPin,

        sickness: validatedFormTwo.sickness,

        moneyCheckBox: validatedFormTwo.moneyCheckBox,
        sicknessCheckBox: validatedFormTwo.sicknessCheckBox,
        consentCheckBox: validatedFormTwo.consentCheckBox,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to save employee information",
      },
      { status: 400 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { guarantorFormSchema } from "@/utils/validation/guarantorForm";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      submissionId,
      ...formData
    } = body;

    const guarantorData = guarantorFormSchema
      .omit({
        validID: true,
        picture: true,
        signature: true,
      })
      .parse(formData);

    const submission = await prisma.submission.findUnique({
      where: {
        id: submissionId,
      },
    });

    if (!submission || submission.type !== "GUARANTOR") {
      return NextResponse.json(
        {
          success: false,
          message: "Guarantor submission not found",
        },
        { status: 404 }
      );
    }

    await prisma.guarantor.create({
      data: {
        submissionId,

        employeeName: guarantorData.employeeName,
        employeeAddress: guarantorData.employeeAddress,
        employeeGender: guarantorData.employeeGender,
        relationship: guarantorData.relationship,
        yearsOfRelationship: guarantorData.yearsOfRelationship,

        firstName: guarantorData.firstName,
        surname: guarantorData.surname,
        otherName: guarantorData.otherName,
        dateOfBirth: guarantorData.dateOfBirth,
        guarGender: guarantorData.guarGender,
        maritalStatus: guarantorData.maritalStatus,
        stateOfOrigin: guarantorData.stateOfOrigin,

        email: guarantorData.email,
        phoneNumber: guarantorData.phoneNumber,
        phoneNumberTwo: guarantorData.phoneNumberTwo,

        occupation: guarantorData.occupation,

        guarHomeAddress: guarantorData.guarHomeAddress,
        guarHomeState: guarantorData.guarHomeState,
        guarHomeLga: guarantorData.guarHomeLga,
        guarHomeCity: guarantorData.guarHomeCity,

        guarOfficeAddress: guarantorData.guarOfficeAddress,
        guarOfficeState: guarantorData.guarOfficeState,
        guarOfficeLga: guarantorData.guarOfficeLga,
        guarOfficeCity: guarantorData.guarOfficeCity,

        checkGuarantorBox: guarantorData.checkGuarantorBox,
        signatureDate: guarantorData.signatureDate,
        consentCheckBox: guarantorData.consentCheckBox,
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
        message: "Unable to save guarantor information",
      },
      { status: 400 }
    );
  }
}
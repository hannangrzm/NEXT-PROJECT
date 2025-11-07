"use client";
import { useState } from "react";
import MilestoneViewer from "./MilestoneViewer";
import MilestoneUpdateForm from "./MilestoneUpdateForm"

export default function MilestoneTest({campaign}: any) {

  const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];
  const [currentStep, setCurrentStep] = useState(1);

  const getStepStatus = (stepNumber: any) => {
    if(stepNumber < currentStep) return "completed";
    if(stepNumber === currentStep) return "active";
    return "inactive";
  }

  return (
    <div>
    <div className="flex items-center justify-between mb-10">

      <div className="w-full max-w-xl">

        <div className="flex items-center justify-between">

          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const status = getStepStatus(stepNumber);

            return (
              <div key={step} className="flex items-center flex-1">
                {/* Step circle */}
                  
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center
                      ${
                        status === "completed"
                        ? "bg-blue-500 text-white"
                        : status === "active"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-600"
                      }`}
                    onClick={() => status !== "inactive" && setCurrentStep(stepNumber)}
                  >
                    {stepNumber}
                  </div>

                {/* Line between steps */}
                {index < steps.length - 1 && (

                  <div
                    className={`h-1 flex-1  ${
                      status === "completed" ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  ></div>

                )}
              </div>
            );

          })}
        </div>
      </div>

      <div>
        <button className="border border-black rounded-2xl px-5 py-2">Update Milestone</button>
      </div>


    </div>
          <div className="border">
            {getStepStatus(currentStep) === "active" ? (
              /**show editable form if step active*/
              <MilestoneUpdateForm
                milestoneNumber={1} // just a dummy milestone number
                milestoneData={{
                  description: "This is a sample description for milestone 1",
                  proofs: [],      // empty for now
                  invoices: []     // empty for now
                }} 
                />
            ) : (
              /**show read-only completed table */
              <MilestoneViewer 
                milestoneNumber={currentStep}
                milestoneData={null} />
            )}

          </div>
    </div>
  );
}

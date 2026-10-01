interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{
    id: number;
    label: string;
  }>;
}

// Barra compacta de una fila: círculos chicos + conectores, y a la derecha
// "Paso X de 5", mini barra de progreso y %. Altura total ~60px para dejar
// el máximo espacio vertical posible al formulario del wizard.
const WizardProgress = ({ currentStep, totalSteps, steps }: WizardProgressProps) => {
  const progressPercentage = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto mb-4 bg-card px-4 py-3 rounded-xl text-card-foreground shadow-sm border border-border">
      <div className="flex items-center gap-4">
        {/* Steps compactos */}
        <div className="flex items-center flex-1 min-w-0">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.id} className={`flex items-center ${isLast ? 'flex-shrink-0' : 'flex-1'}`}>
                <div
                  title={step.label}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 flex-shrink-0 ${isActive
                    ? 'bg-primary border-primary text-primary-foreground scale-110 shadow-md'
                    : isCompleted
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-card border-border text-muted-foreground'
                    }`}
                >
                  {isCompleted ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                {!isLast && (
                  <div className={`flex-1 h-0.5 mx-1.5 rounded ${stepNumber < currentStep ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Paso actual + progreso */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right leading-tight">
            <p className="text-xs font-bold">
              Paso {currentStep} de {totalSteps}
            </p>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
              {steps[currentStep - 1]?.label}
            </p>
          </div>
          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-xs font-bold text-primary w-9 text-right">
            {progressPercentage}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default WizardProgress;

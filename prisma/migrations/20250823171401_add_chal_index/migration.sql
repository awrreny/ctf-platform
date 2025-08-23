-- CreateIndex
CREATE INDEX "Submission_challengeId_isCorrect_idx" ON "Submission"("challengeId", "isCorrect");

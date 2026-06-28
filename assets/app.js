const completed = new Set(JSON.parse(localStorage.getItem("civicPrepCompleted") || "[]"));
const totalSteps = 5;

function updateProgress() {
  const count = completed.size;
  document.getElementById("progressText").textContent = `${count} / ${totalSteps}`;
  document.getElementById("progressBar").style.width = `${(count / totalSteps) * 100}%`;
  localStorage.setItem("civicPrepCompleted", JSON.stringify([...completed]));
}

document.querySelectorAll("[data-complete]").forEach((button) => {
  button.addEventListener("click", () => {
    completed.add(button.dataset.complete);
    button.textContent = "已完成";
    updateProgress();
  });
});

document.querySelectorAll("[data-complete]").forEach((button) => {
  if (completed.has(button.dataset.complete)) {
    button.textContent = "已完成";
  }
});

document.querySelectorAll("[data-answer]").forEach((button) => {
  button.addEventListener("click", () => {
    const isRight = button.dataset.answer === "right";
    button.classList.toggle("correct", isRight);
    button.classList.toggle("incorrect", !isRight);
    document.getElementById("quizResult").textContent = isRight
      ? "答對了，請繼續完成其他題目。"
      : "再想想：規範要清楚，也要能照顧大家。";
  });
});

const sequenceButtons = document.getElementById("sequenceButtons");
const sequenceList = document.getElementById("sequenceList");
const sequenceResult = document.getElementById("sequenceResult");
const selectedOrders = [];

sequenceButtons.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    selectedOrders.push(Number(button.dataset.order));
    const item = document.createElement("li");
    item.textContent = button.textContent;
    sequenceList.appendChild(item);
    button.disabled = true;

    if (selectedOrders.length === 5) {
      const correct = selectedOrders.every((order, index) => order === index + 1);
      sequenceResult.textContent = correct
        ? "流程正確。班會要先宣布開會，再報告、討論、表決與宣布結果。"
        : "順序還可以再調整。提示：先開會與報告，再討論、表決、宣布結果。";
    }
  });
});

document.getElementById("resetSequence").addEventListener("click", () => {
  selectedOrders.length = 0;
  sequenceList.innerHTML = "";
  sequenceResult.textContent = "";
  sequenceButtons.querySelectorAll("button").forEach((button) => {
    button.disabled = false;
  });
});

["problem", "impact", "idea"].forEach((id) => {
  const field = document.getElementById(id);
  field.value = localStorage.getItem(`civicPrep_${id}`) || "";
});

document.getElementById("saveReflection").addEventListener("click", () => {
  ["problem", "impact", "idea"].forEach((id) => {
    localStorage.setItem(`civicPrep_${id}`, document.getElementById(id).value);
  });
  completed.add("reflection");
  updateProgress();
  document.getElementById("saveStatus").textContent = "已儲存在這台裝置。下一堂課可以列印或打開給老師看。";
});

document.getElementById("printPage").addEventListener("click", () => {
  window.print();
});

updateProgress();
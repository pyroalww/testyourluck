document.addEventListener("DOMContentLoaded", function () {
    const modSelect = document.getElementById("mod-select");
    const percentInput = document.getElementById("percent-input");
    const percent = document.getElementById("percent");
    const eventInput = document.getElementById("event-input");
    const event = document.getElementById("event");
    const attemptInput = document.getElementById("attempt-input");
    const startBtn = document.getElementById("start-btn");
    const resetBtn = document.getElementById("reset-btn");
    const tutorialBtn = document.getElementById("tutorial-btn");
    const progressBar = document.getElementById("progress-bar");
    const resultChart = document.getElementById("result-chart").getContext("2d");
    const successCountSpan = document.getElementById("success-count");
    const failureCountSpan = document.getElementById("failure-count");
    const averageSuccessRateSpan = document.getElementById("average-success-rate");
    const elapsedTimeSpan = document.getElementById("elapsed-time");

    let startTime;
    let chart;

    modSelect.addEventListener("change", function () {
        if (modSelect.value === "Yüzdelik Olasılık") {
            percentInput.style.display = "block";
            eventInput.style.display = "none";
        } else if (modSelect.value === "Seçim Çarkı") {
            percentInput.style.display = "none";
            eventInput.style.display = "block";
        } else {
            percentInput.style.display = "none";
            eventInput.style.display = "none";
        }
    });

    startBtn.addEventListener("click", function () {
        startExperiment();
    });

    resetBtn.addEventListener("click", function () {
        resetExperiment();
    });

    tutorialBtn.addEventListener("click", function () {
        showTutorial();
    });

    function startExperiment() {
        const mod = modSelect.value;
        const attempts = parseInt(attemptInput.value);

        if (mod === "Yüzdelik Olasılık") {
            const successProbability = parseInt(percent.value);
            if (isNaN(successProbability) || successProbability <= 0 || successProbability > 100) {
                alert("Geçerli bir yüzdelik olasılık girin.");
                return;
            }
        }

        if (mod === "Seçim Çarkı") {
            if (!event.value) {
                alert("Lütfen bir olay girin.");
                return;
            }
        }

        progressBar.style.width = "0%";
        progressBar.innerText = "";

        startTime = new Date().getTime();

        let successes = 0;
        let failures = 0;

        for (let i = 0; i < attempts; i++) {
            let result;

            if (mod === "Yüzdelik Olasılık") {
                const successProbability = parseInt(percent.value) / 100;
                result = Math.random() < successProbability;
            } else if (mod === "Olacak Olmayacak") {
                result = Math.random() < 0.5;
            } else if (mod === "Seçim Çarkı") {
                const events = event.value.split(",");
                const selectedEvent = events[Math.floor(Math.random() * events.length)];
                alert("Seçilen olay: " + selectedEvent);
                continue;
            } else if (mod === "Öngörü") {
                result = Math.random() < 0.5;
            }

            if (result) {
                successes++;
            } else {
                failures++;
            }

            progressBar.style.width = ((i + 1) / attempts) * 100 + "%";
            progressBar.innerText = ((i + 1) / attempts) * 100 + "%";
        }

        const endTime = new Date().getTime();
        const elapsedTime = (endTime - startTime) / 1000;

        const successRate = (successes / attempts) * 100 || 0;

        updateStatistics(successes, failures, successRate, elapsedTime);
        updateChart(successes, failures);
    }

    function resetExperiment() {
        progressBar.style.width = "0%";
        progressBar.innerText = "";

        percent.value = "";
        event.value = "";
        attemptInput.value = "1";

        successCountSpan.innerText = "0";
        failureCountSpan.innerText = "0";
        averageSuccessRateSpan.innerText = "0%";
        elapsedTimeSpan.innerText = "0 saniye";

        if (chart) {
            chart.destroy();
        }
    }

    function updateStatistics(successes, failures, successRate, elapsedTime) {
        successCountSpan.innerText = successes;
        failureCountSpan.innerText = failures;
        averageSuccessRateSpan.innerText = successRate.toFixed(2) + "%";
        elapsedTimeSpan.innerText = elapsedTime + " saniye";
    }

    function updateChart(successes, failures) {
        if (chart) {
            chart.destroy();
        }

        chart = new Chart(resultChart, {
            type: "bar",
            data: {
                labels: ["Başarılı", "Başarısız"],
                datasets: [{
                    label: "Sonuçlar",
                    data: [successes, failures],
                    backgroundColor: ["green", "red"]
                }]
            },
            options: {
                responsive: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    function showTutorial() {
        const tutorialText = `
        Bu uygulamada farklı modlarda şans deneyleri yapabilirsiniz.
        - Yüzdelik Olasılık: Belirli bir olayın gerçekleşme olasılığını kontrol edebilirsiniz.
        - Olacak Olmayacak: Olma ya da olmama durumlarını test edebilirsiniz.
        - Seçim Çarkı: Bir liste içinden rastgele bir olay seçebilirsiniz.
        - Öngörü: Herhangi bir öngörüde bulunmadan şans deneyleri yapabilirsiniz.
        `;
        alert(tutorialText);
    }
});

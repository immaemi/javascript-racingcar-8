import { Console, Random } from "@woowacourse/mission-utils";

class App {
  _validateSeparator(carNameInput) {
    // 특수문자 구분자 검증 (세미콜론, 콜론 등)
    const invalidSeparators = /[;:|@#$%^&*()_+=\[\]{}'";<>?\/\\~`]/;
    if (invalidSeparators.test(carNameInput)) {
      throw new Error(
        "[ERROR] 자동차 이름은 쉼표(,) 기준으로만 구분해야 합니다."
      );
    }
    return true;
  }

  _validateEmptyName(carNames) {
    for (let name of carNames) {
      if (name === "") {
        throw new Error("[ERROR] 자동차 이름은 공백으로만 구성될 수 없습니다.");
      }
    }
  }

  _validateEnglishName(carNames) {
    for (let name of carNames) {
      if (!/^[a-zA-Z0-9가-힣]+$/.test(name)) {
        throw new Error(
          "[ERROR] 자동차 이름은 영어, 숫자, 한국어로만 구성되어야 합니다(이름 내 공백이나 특수문자는 불가합니다)."
        );
      }
    }
  }

  _validateMaxLength(carNames) {
    for (let name of carNames) {
      if (name.length > 5) {
        throw new Error("[ERROR] 자동차 이름은 5자 이하여야 합니다.");
      }
    }
  }

  _validateDuplicateName(carNames) {
    const uniqueNames = new Set(carNames);
    if (uniqueNames.size !== carNames.length) {
      throw new Error("[ERROR] 자동차 이름은 중복될 수 없습니다.");
    }
  }

  validateCarNames(carNameInput) {
    // 1. 구분자 검증
    this._validateSeparator(carNameInput);

    // 2. 쉼표로 분리 및 공백 제거
    const carNames = carNameInput.split(",").map((name) => name.trim());

    // 3. 검증 로직 실행
    this._validateEmptyName(carNames); // 빈 이름 검증
    this._validateEnglishName(carNames); // 문자 검증
    this._validateMaxLength(carNames); // 길이 검증
    this._validateDuplicateName(carNames); // 중복 검증

    return carNames;
  }

  _validateNumberStringFormat(attemptCountInput) {
    const trimmedInput = attemptCountInput.trim();

    if (trimmedInput === "") {
      throw new Error("[ERROR] 시도할 횟수를 입력해야 합니다.");
    }

    // 숫자 형태만 허용 (음수, 소수 포함)
    if (!/^-?\d+(\.\d+)?$/.test(trimmedInput)) {
      throw new Error(
        "[ERROR] 시도할 횟수는 숫자로만 입력해야 합니다. (공백과 문자는 불가합니다)."
      );
    }

    return trimmedInput;
  }

  _validatePositiveRange(number) {
    if (!Number.isInteger(number) || number <= 0) {
      throw new Error(
        "[ERROR] 시도할 횟수는 1 이상의 양의 정수여야 합니다.(소수와 음수는 불가합니다)."
      );
    }
  }

  validateAttemptCount(attemptCountInput) {
    const validatedInput = this._validateNumberStringFormat(attemptCountInput);
    const number = Number(validatedInput);
    this._validatePositiveRange(number);
    return number;
  }

  moveCars(carPositions) {
    return carPositions.map((position) => {
      const randomNumber = Random.pickNumberInRange(0, 9);
      if (randomNumber >= 4) {
        return position + 1;
      } else {
        return position;
      }
    });
  }

  runRace(carNames, attemptCount) {
    Console.print("\n실행결과");
    // 각 자동차의 현재 위치를 저장하는 배열
    let carPositions = new Array(carNames.length).fill(0);

    // 경주 실행
    for (let round = 0; round < attemptCount; round++) {
      // 자동차 이동 처리
      carPositions = this.moveCars(carPositions);
      this.printRoundResult(carNames, carPositions);
    }
    this.printFinalResult(carNames, carPositions);
  }

  printRoundResult(carNames, carPositions) {
    for (let i = 0; i < carNames.length; i++) {
      const position = "-".repeat(carPositions[i]);
      Console.print(`${carNames[i]} : ${position}`);
    }
    Console.print(""); // 빈 줄
  }

  printFinalResult(carNames, carPositions) {
    const maxPosition = Math.max(...carPositions);
    const winners = carNames.filter(
      (name, index) => carPositions[index] === maxPosition
    );
    Console.print(`최종 우승자 : ${winners.join(", ")}`);
  }

  async run() {
    try {
      const carNameInput = await Console.readLineAsync(
        "경주할 자동차 이름을 입력하세요.(이름은 쉼표(,) 기준으로 구분)\n"
      );
      const carNames = this.validateCarNames(carNameInput);

      const attemptCountInput = await Console.readLineAsync(
        "시도할 횟수는 몇 회인가요?\n"
      );
      const attemptCount = this.validateAttemptCount(attemptCountInput);

      // 경주 실행
      this.runRace(carNames, attemptCount);
    } catch (error) {
      Console.print(error.message);
      throw error;
    }
  }
}

export default App;

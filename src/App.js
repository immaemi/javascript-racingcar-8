import { Console , Random } from "@woowacourse/mission-utils";

class App {
  /**
   * 구분자 검증 - 쉼표(,) 외의 구분자 사용 시 에러 발생
   * @param {string} carNameInput - 사용자 입력 문자열
   * @throws {Error} 쉼표 외의 구분자 사용 시
   */
  _validateSeparator(carNameInput) {
    // 특수문자 구분자 검증 (세미콜론, 콜론 등)
    const invalidSeparators = /[;:|@#$%^&*()_+=\[\]{}'";<>?\/\\~`]/;
    if(invalidSeparators.test(carNameInput)) {
      throw new Error("[ERROR] 자동차 이름은 쉼표(,) 기준으로만 구분해야 합니다.");
    }
    return true;
  }

  /**
   * 빈 이름 검증 - 공백으로만 구성된 이름 차단
   * @param {string[]} carNames - 자동차 이름 배열
   * @throws {Error} 빈 문자열이 포함된 경우
   */
  _validateEmptyName(carNames) {
    for(let name of carNames) {
      if (name === "") {
        throw new Error("[ERROR] 자동차 이름은 공백으로만 구성될 수 없습니다.");
      }
    }
  }

  /**
   * 문자 검증 - 영어, 숫자, 한국어만 허용
   * @param {string[]} carNames - 자동차 이름 배열
   * @throws {Error} 허용되지 않는 문자가 포함된 경우
   */
  _validateEnglishName(carNames) {
    for(let name of carNames) {
      if(!/^[a-zA-Z0-9가-힣]+$/.test(name)) {
        throw new Error("[ERROR] 자동차 이름은 영어, 숫자, 한국어로만 구성되어야 합니다(이름 내 공백이나 특수문자는 불가합니다).");
      }
    }
  }

  /**
   * 길이 검증 - 5자 이하만 허용
   * @param {string[]} carNames - 자동차 이름 배열
   * @throws {Error} 6자 이상인 이름이 포함된 경우
   */
  _validateMaxLength(carNames) {
    for(let name of carNames) {
      if(name.length > 5) {
        throw new Error("[ERROR] 자동차 이름은 5자 이하여야 합니다.");
      }
    }
  } 

  /**
   * 중복 검증 - 중복된 이름 차단
   * @param {string[]} carNames - 자동차 이름 배열
   * @throws {Error} 중복된 이름이 있는 경우
   */
  _validateDuplicateName(carNames) {
    const uniqueNames = new Set(carNames);
    if (uniqueNames.size !== carNames.length) {
      throw new Error("[ERROR] 자동차 이름은 중복될 수 없습니다.");
    }
  }

  /**
   * 자동차 이름 입력 검증 메인 함수
   * @param {string} carNameInput - 사용자 입력 문자열
   * @returns {string[]} 검증된 자동차 이름 배열
   * @throws {Error} 검증 실패 시
   */
  validateCarNames(carNameInput) {
    // 1. 구분자 검증
    this._validateSeparator(carNameInput);

    // 2. 쉼표로 분리 및 공백 제거
    const carNames = carNameInput.split(",").map(name => name.trim());
    
    // 3. 검증 로직 실행
    this._validateEmptyName(carNames);     // 빈 이름 검증
    this._validateEnglishName(carNames);   // 문자 검증
    this._validateMaxLength(carNames);      // 길이 검증
    this._validateDuplicateName(carNames); // 중복 검증

    return carNames;
  }

  /**
   * 문자열 포맷 검증 - 빈 값, 공백, 숫자 외 문자가 없는지 확인
   * @param {string} attemptCountInput - 사용자 입력 문자열
   * @returns {string} 검증된 문자열 (공백 제거됨)
   * @throws {Error} 유효하지 않은 문자열 포맷 시
   */
  _validateNumberStringFormat(attemptCountInput) {
    const trimmedInput = attemptCountInput.trim();
    
    if (trimmedInput === "") {
      throw new Error("[ERROR] 시도할 횟수를 입력해야 합니다.");
    }

    // 숫자 형태만 허용 (음수, 소수 포함)
    if (!/^-?\d+(\.\d+)?$/.test(trimmedInput)) {
      throw new Error("[ERROR] 시도할 횟수는 숫자로만 입력해야 합니다. (공백과 문자는 불가합니다).");
    }
    
    return trimmedInput;
  }

  /**
   * 양의 정수 검증 - 1 이상의 양의 정수인지 확인
   * @param {number} number - 검증할 숫자
   * @throws {Error} 양의 정수가 아닌 경우
   */
  _validatePositiveRange(number) {
    if(!Number.isInteger(number) || number <= 0) {
      throw new Error("[ERROR] 시도할 횟수는 1 이상의 양의 정수여야 합니다.(소수와 음수는 불가합니다).");
    }
  }

  /**
   * 이동 횟수 입력 검증 메인 함수
   * @param {string} attemptCountInput - 사용자 입력 문자열
   * @returns {number} 검증된 이동 횟수
   * @throws {Error} 검증 실패 시
   */
  validateAttemptCount(attemptCountInput) {
    this._validateNumberStringFormat(attemptCountInput);
    const number = Number(this._validateNumberStringFormat(attemptCountInput)); // 숫자로 변환
    this._validatePositiveRange(number);
    return number;
  }

  /**
   * 자동차 이동 처리 - 랜덤값에 따라 전진 여부 결정
   * @param {number[]} carPositions - 각 자동차의 현재 위치 배열
   * @returns {number[]} 업데이트된 위치 배열
   */
  moveCars(carPositions) {
    return carPositions.map(position => {
      const randomNumber = Random.pickNumberInRange(0, 9);
      if(randomNumber >= 4) {
        return position + 1;
      } else {
        return position;
      }
    });
  }


  /**
   * 경주 실행 메인 함수 
   * @param {string[]} carNames - 자동차 이름 배열
   * @param {number} attemptCount - 시도 횟수
   */
  runRace(carNames, attemptCount) {
    // 각 자동차의 현재 위치를 저장하는 배열
    const carPositions = new Array(carNames.length).fill(0);

    // 경주 실행 (이동 로직만)
    for(let round = 0; round < attemptCount; round++) {
      // 자동차 이동 처리
      const updatedPositions = this.moveCars(carPositions);
      
      // 위치 업데이트
      for(let i = 0; i < carNames.length; i++) {
        carPositions[i] = updatedPositions[i];
      }
    }
  }

  async run() {
    const carNameInput = await Console.readLineAsync("경주할 자동차 이름을 입력하세요.(이름은 쉼표(,) 기준으로 구분)\n");
    const carNames = this.validateCarNames(carNameInput);

    const attemptCountInput = await Console.readLineAsync("시도할 횟수는 몇 회인가요?\n");
    const attemptCount = this.validateAttemptCount(attemptCountInput);

    // 경주 실행
    this.runRace(carNames, attemptCount);
  }
}

export default App;

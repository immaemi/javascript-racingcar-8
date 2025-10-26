import { Console } from "@woowacourse/mission-utils";

class App {
  /**
   * 구분자 검증 - 쉼표(,) 외의 구분자 사용 시 에러 발생
   * @param {string} input - 사용자 입력 문자열
   * @throws {Error} 쉼표 외의 구분자 사용 시
   */
  _validateSeparator(input) {
    // 특수문자 구분자 검증 (세미콜론, 콜론 등)
    const invalidSeparators = /[;:|@#$%^&*()_+=\[\]{}'";<>?\/\\~`]/;
    if(invalidSeparators.test(input)) {
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
   * @param {string} input - 사용자 입력 문자열
   * @returns {string[]} 검증된 자동차 이름 배열
   * @throws {Error} 검증 실패 시
   */
  validateInput(input) {
    // 1. 구분자 검증
    this._validateSeparator(input);

    // 2. 쉼표로 분리 및 공백 제거
    const carNames = input.split(",").map(name => name.trim());
    
    // 3. 검증 로직 실행
    this._validateEmptyName(carNames);     // 빈 이름 검증
    this._validateEnglishName(carNames);   // 문자 검증
    this._validateMaxLength(carNames);      // 길이 검증
    this._validateDuplicateName(carNames); // 중복 검증

    return carNames;
  }
  async run() {
    const input = await Console.readLineAsync("경주할 자동차 이름을 입력하세요.(이름은 쉼표(,) 기준으로 구분)\n");
    const carNames = this.validateInput(input);
    Console.print(carNames);
  }
}

export default App;

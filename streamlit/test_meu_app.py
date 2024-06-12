import unittest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By 
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import os
import time
import pyautogui

class TestVideoUploaderAppSelenium(unittest.TestCase):
    def setUp(self):
        options = webdriver.ChromeOptions()
        # options.add_argument("--headless")

        driver_path = ChromeDriverManager().install()

        service = Service(driver_path)

        self.driver = webdriver.Chrome(service=service, options=options)

        self.driver.get("http://localhost:8501") 
        self.driver.implicitly_wait(10)

    def tearDown(self):

        self.driver.quit()

    def test_upload_video_success(self):
        time.sleep(5)

        upload_input = self.driver.find_element(By.XPATH, "//input[@type='file']")


        test_video_path = os.path.abspath("video_teste/video_teste.mp4")
        upload_input.send_keys(test_video_path)

        time.sleep(2)
        pyautogui.click(418, 510)

        success_message = WebDriverWait(self.driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'stAlert')]"))
    )

        self.assertTrue(success_message.is_displayed(), "A mensagem de sucesso não está sendo exibida.")


if __name__ == '__main__':
    unittest.main()
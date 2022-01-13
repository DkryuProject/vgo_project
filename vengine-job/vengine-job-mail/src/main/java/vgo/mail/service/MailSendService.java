package vgo.mail.service;

import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;
import vgo.mail.dto.*;
import vgo.mail.mapper.MailMapper;

import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Slf4j
public class MailSendService {
    @Value("${vengine.api.url}")
    String apiUrl;

    @Value("${vengine.web.url}")
    String webUrl;

    @Value("${AdminMail.id}")
    private String adminMail;

    @Autowired
    MailMapper mailMapper;

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    public List<MailDto> searchSendMailList() {
        return mailMapper.searchSendMailList();
    }

    public void mailSend(MailDto mailDto) throws Exception {
        try{
            MimeMessage message = createMailMessage(mailDto);
            javaMailSender.send(message);
        }catch(MailException | MessagingException | IOException es){
            es.printStackTrace();
            throw new Exception(es.getMessage());
        }
    }

    public void updateMailStatus(MailDto mailDto) {
        mailMapper.updateMail(mailDto);
    }

    private MimeMessage createMailMessage(MailDto mailDto) throws MessagingException, IOException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        String title  = "";
        Context context = new Context();
        String mailHtml = "";

        //메일종류
        //0: 초대메일, 1: po 알림, 2: 회사 가입 요청, 3: 회사 승인, 4:자재 등록, 5.파트너 회사 승인, 6: ADHOC PO 알림, 7: 파티너 등록 알림, 8: Password Reset, 12: 회원 가입 요청, 15: 합류 요청
        if(mailDto.getType() == 0){
            UserDto userDto = mailMapper.searchUser(mailDto.getIdx());
            String password = getUserPassword(mailDto.getEmail());
            if(password == ""){
                throw new RuntimeException("password is null");
            }
            title = ""+userDto.getRegisterCompany()+" invites you";
            context.setVariable("user_name", userDto.getUserName()==null?"":userDto.getUserName());
            context.setVariable("user_company_name", userDto.getCompany()==null?"":userDto.getCompany());
            context.setVariable("user_id", userDto.getEmail());
            context.setVariable("user_pw", password);
            mailHtml = templateEngine.process("mail/vgo_email_invite", context);
        }else if(mailDto.getType() == 1 || mailDto.getType() == 6) {
            OrderDto orderDto = null;
            String url = "";
            if(mailDto.getType() == 1){
                orderDto = mailMapper.searchOrderInfo(mailDto.getIdx());
            }else{
                orderDto = mailMapper.searchAdhocOrderInfo(mailDto.getIdx());
            }
            if(orderDto == null){
                throw new RuntimeException("order info is null");
            }
            title = "["+ orderDto.getPoNumber()+"] PO has been published to your company";
            context.setVariable("company_name", orderDto.getCompanyName());
            context.setVariable("user_company_name", orderDto.getUserCompanyName());
            context.setVariable("po_number", orderDto.getPoNumber());
            if(mailDto.getType() == 1){
                mailHtml = templateEngine.process("mail/vgo_email_po", context);
            }else{
                mailHtml = templateEngine.process("mail/vgo_email_adhoc_po", context);
            }
        }else if(mailDto.getType() == 2){
            CompanyDto companyDto = mailMapper.searchCompany(mailDto.getIdx());
            title ="["+companyDto.getName()+"] 회사 등록 요청 드립니다.";
            context.setVariable("company_name", companyDto.getName());
            context.setVariable("request_date", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
            mailHtml = templateEngine.process("mail/vgo_email_request", context);
        }else if(mailDto.getType() == 3 || mailDto.getType() == 5){
            String password = "";
            UserDto userDto = mailMapper.searchUser(mailDto.getIdx());

            if(userDto.getPassword() == null){
                password = getUserPassword(mailDto.getEmail());
                if(password == ""){
                    throw new RuntimeException("password is null");
                }

                if(mailDto.getType() == 3){
                    title = String.format("Welcome to V%cgo!",183);
                    context.setVariable("company_name", userDto.getCompany());
                    context.setVariable("user_id", userDto.getEmail());
                    context.setVariable("user_pw", password);
                    mailHtml = templateEngine.process("mail/vgo_email_confirm", context);
                }else if(mailDto.getType() == 5){
                    title = "["+userDto.getRegisterCompany()+"] invites you.";
                    context.setVariable("user_company_name", userDto.getRegisterCompany());
                    context.setVariable("company_name", userDto.getCompany());
                    context.setVariable("user_id", userDto.getEmail());
                    context.setVariable("user_pw", password);
                    mailHtml = templateEngine.process("mail/vgo_email_partner_confirm", context);
                }
            }else{
                title = String.format("Welcome to V%cgo!",183);
                context.setVariable("company_name", userDto.getCompany());
                mailHtml = templateEngine.process("mail/vgo_email_company_confirm", context);
            }
        }else if(mailDto.getType() == 4) {
            MaterialDto materialDto = mailMapper.searchMaterialInfo(mailDto.getIdx());
            title = "Your item has been registered.";
            context.setVariable("user_company_name", materialDto.getUserCompanyName());
            context.setVariable("company_name", materialDto.getCompanyName());
            context.setVariable("material_name", materialDto.getMaterialName());
            mailHtml = templateEngine.process("mail/vgo_email_material", context);
        }else if(mailDto.getType() == 7) {
            CompanyBizRequestDto companyDto = mailMapper.searchCompanyBizRequest(mailDto.getIdx());
            title = "A new partnership request";
            context.setVariable("user_company_name", companyDto.getResponseCompany());
            context.setVariable("company_name", companyDto.getRequestCompany());
            mailHtml = templateEngine.process("mail/vgo_email_partner_register", context);
        }else if(mailDto.getType() == 8){
            UserDto userDto = mailMapper.searchUser(mailDto.getIdx());
            String password = getUserPassword(mailDto.getEmail());
            if(password == ""){
                throw new RuntimeException("password is null");
            }
            title = "Your password has been initialized.";
            context.setVariable("user_name", userDto.getUserName());
            context.setVariable("user_id", userDto.getEmail());
            context.setVariable("user_pw", password);
            mailHtml = templateEngine.process("mail/vgo_email_reset", context);
        }else if(mailDto.getType() == 9) {
            CompanyBizRequestDto companyDto = mailMapper.searchCompanyBizRequest(mailDto.getIdx());
            title = "New partnership request from "+companyDto.getRequestCompany();
            context.setVariable("company_name", companyDto.getResponseCompany());
            context.setVariable("user_company_name", companyDto.getRequestCompany());
            mailHtml = templateEngine.process("mail/vgo_email_partner_request", context);
        }else if(mailDto.getType() == 10 || mailDto.getType() == 11) {
            CompanyBizRequestDto companyDto = mailMapper.searchCompanyBizRequest(mailDto.getIdx());
            if(mailDto.getType() == 10){
                title = "["+companyDto.getResponseCompany()+"] Partnership request is accepted";
            }else{
                title = "["+companyDto.getResponseCompany()+"] Partnership request is rejected";
            }
            context.setVariable("company_name", companyDto.getRequestCompany());
            if(mailDto.getType() == 10){
                context.setVariable("text1","Congratulations! Your request to partnering "+companyDto.getResponseCompany()+" is accepted successfully.We hope you keep making fruitful relationships in V&#183;go.");
            }else{
                context.setVariable("text1","Unfortunately, your request to partnering "+companyDto.getResponseCompany()+" is rejected.We hope you find another fruitful relationship in V&#183;go.");
            }
            mailHtml = templateEngine.process("mail/vgo_email_partner_response", context);
        }else if(mailDto.getType() == 12){
            UserDto userDto = mailMapper.searchUser(mailDto.getIdx());

            title = String.format("[V%cgo] Please log in after activation.",183);
            context.setVariable("user_name", userDto.getUserName());
            context.setVariable("user_email", userDto.getEmail());
            context.setVariable("secret_key", userDto.getSecretKey());
            context.setVariable("url", webUrl+"/#/verify?email="+userDto.getEmail()+"&code="+userDto.getSecretKey());
            mailHtml = templateEngine.process("mail/vgo_email_user", context);
        }else if(mailDto.getType() == 15){
            JoinRequestDto joinRequestDto = mailMapper.searchJoinInfo(mailDto.getIdx());

            title = "You have a group joining request.";
            context.setVariable("company_name", joinRequestDto.getCompanyName());
            context.setVariable("user_name", joinRequestDto.getUserName());
            context.setVariable("user_email", joinRequestDto.getUserEmail());
            mailHtml = templateEngine.process("mail/vgo_email_join_request", context);
        }else if(mailDto.getType() == 16 || mailDto.getType() == 17){
            JoinRequestDto joinRequestDto = mailMapper.searchJoinInfo(mailDto.getIdx());

            if(mailDto.getType() == 16){
                title = "["+joinRequestDto.getCompanyName()+"] Admin has accepted your joining request.";
            }else{
                title = "["+joinRequestDto.getCompanyName()+"] Admin has rejected your joining request";
            }
            context.setVariable("user_name", joinRequestDto.getUserName());

            if(mailDto.getType() == 16){
                mailHtml = templateEngine.process("mail/vgo_email_join_response1", context);
            }else{
                mailHtml = templateEngine.process("mail/vgo_email_join_response2", context);
            }
        }

        helper.setFrom(adminMail, String.format("V%cgo Team",183));
        if(System.getProperty("spring.profiles.active").equals("dev")){
            title = "(Dev) "+ title;
        }

        helper.setSubject(title);
        helper.setTo(mailDto.getEmail());
        //helper.setTo("dkryu@v-go.io");
        helper.setText(mailHtml, true);
        return message;
    }

    private String getUserPassword(String email) throws IOException {
        String password = "";
        URL urlConnection = new URL(apiUrl+"/v1/user/password/"+email);
        HttpURLConnection httpURLConnection = (HttpURLConnection) urlConnection.openConnection();

        httpURLConnection.setDoOutput(true);
        httpURLConnection.setRequestProperty("Content-Type", "application/json;utf-8");
        httpURLConnection.setRequestProperty("Accept", "application/json");
        httpURLConnection.setRequestMethod("GET");

        int responseCode = httpURLConnection.getResponseCode();
        BufferedReader in = new BufferedReader(new InputStreamReader(httpURLConnection.getInputStream(), "utf-8"));

        String inputLine;
        StringBuffer response = new StringBuffer();

        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();

        log.info("HTTP 응답 코드 : " + responseCode);
        log.info("HTTP body : " + response.toString());
        ResponseDto result =  new Gson().fromJson(response.toString(), ResponseDto.class);
        password = result.getData();
        httpURLConnection.disconnect();
        return password;
    }
}

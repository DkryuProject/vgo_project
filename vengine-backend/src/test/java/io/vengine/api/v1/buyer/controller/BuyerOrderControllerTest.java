package io.vengine.api.v1.buyer.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.filter.CharacterEncodingFilter;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
class BuyerOrderControllerTest {
    @Autowired
    private WebApplicationContext ctx;

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    public void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(ctx)
                .addFilter(new CharacterEncodingFilter("UTF-8", true))
                .alwaysDo(print())
                .build();
    }

    @Test
    @WithUserDetails("dkryu@v-go.io")
    @DisplayName("Buyer Order 조회 테스트")
    void findPurchaseOrder() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/v1/buyer/orders?page=1&size=3&searchKeyWord="))
                .andExpect(status().isOk());
    }

    @Test
    @WithUserDetails("dkryu@v-go.io")
    @DisplayName("Mcl Pre booking 에 대한 Buyer Order 조회 테스트")
    void findMappedPO() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/v1/buyer/orders/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithUserDetails("dkryu@v-go.io")
    @DisplayName("Garment PO 조회 (Style Number) 테스트")
    void findGarmentPoByStyle() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/v1/garment/po/style/1234"))
                .andExpect(status().isOk());
    }

    @Test
    void findBuyerApiInfo() {
    }

    @Test
    void saveBuyerApiInfo() {
    }
}